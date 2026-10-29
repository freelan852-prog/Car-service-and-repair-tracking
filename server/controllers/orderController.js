/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Order } from '../models/Order.js';
import { Vehicle } from '../models/Vehicle.js';
import { fallbackStore } from '../utils/dataStore.js';
import { isConnected } from '../config/db.js';
import { PRICING_TABLE, calculatePrice } from '../config/pricing.js';
import { updateOrderTracking } from '../utils/tracking.js';

function getOrderRepo() {
  return isConnected() ? Order : fallbackStore.orders;
}

function getVehicleRepo() {
  return isConnected() ? Vehicle : fallbackStore.vehicles;
}

export async function createOrder(req, res, next) {
  try {
    const { vehicleId, serviceIds, pickupOption, slot, address, paymentMode } = req.body;

    if (!vehicleId || !serviceIds || !Array.isArray(serviceIds) || serviceIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'A vehicle and at least one selected service are required to create an order.',
      });
    }

    if (!slot) {
      return res.status(400).json({
        success: false,
        message: 'A service time slot is required.',
      });
    }

    const vRepo = getVehicleRepo();
    const vehicle = await vRepo.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Selected vehicle not found.',
      });
    }

    const ownerId = vehicle.user?.toString() || vehicle.user;
    if (ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this vehicle.',
      });
    }

    // Server-side price calculation only - client prices are ignored
    const catalog =
      vehicle.type === 'bike' ? PRICING_TABLE.bikeServices : PRICING_TABLE.carServices;

    const items = [];
    let lockedTotal = 0;

    for (const sid of serviceIds) {
      const match = catalog.find((s) => s.id === sid);
      if (match) {
        const lockedPrice = calculatePrice(
          match.basePrice,
          vehicle.type,
          vehicle.segment,
          vehicle.fuel
        );
        items.push({
          serviceId: match.id,
          name: match.name,
          lockedPrice,
          category: match.category,
          durationHours: match.durationHours,
        });
        lockedTotal += lockedPrice;
      }
    }

    if (items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'None of the requested services match the vehicle catalog.',
      });
    }

    const vehicleSnapshot = {
      vehicleId: vehicle._id ? vehicle._id.toString() : vehicle.id,
      type: vehicle.type,
      brand: vehicle.brand,
      model: vehicle.model,
      segment: vehicle.segment,
      fuel: vehicle.fuel,
      year: vehicle.year,
      regNo: vehicle.regNo,
    };

    const initialLog = [
      {
        type: 'order_created',
        message: 'Order created with locked rate guarantee. Price cannot increase without your permission.',
        timestamp: new Date(),
      },
    ];

    const orderData = {
      user: req.user.id,
      vehicle: vehicleSnapshot,
      items,
      lockedTotal,
      pickupOption: pickupOption === 'self' ? 'self' : 'pickup',
      slot,
      address: address ? address.trim() : '',
      paymentMode: paymentMode || 'pay_after_service',
      status: 'Booked',
      startedAt: new Date(),
      pausedDurationSeconds: 0,
      extras: [],
      log: initialLog,
      finalTotal: lockedTotal,
    };

    const oRepo = getOrderRepo();
    let order = await oRepo.create(orderData);

    // Run tracking update
    order = updateOrderTracking(order);
    if (order.save) {
      await order.save();
    } else if (fallbackStore.orders.save) {
      await fallbackStore.orders.save(order);
    }

    const id = order._id ? order._id.toString() : order.id;

    res.status(201).json({
      success: true,
      message: 'Order booked successfully with locked price guarantee.',
      order: {
        ...order.toJSON ? order.toJSON() : order,
        id,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getOrders(req, res, next) {
  try {
    const oRepo = getOrderRepo();
    const list = await oRepo.find({ user: req.user.id });

    // Update tracking on each order before returning
    const updatedList = [];
    for (let ord of list) {
      ord = updateOrderTracking(ord);
      if (ord.save) {
        await ord.save();
      } else if (fallbackStore.orders.save) {
        await fallbackStore.orders.save(ord);
      }
      const id = ord._id ? ord._id.toString() : ord.id;
      updatedList.push({
        ...ord.toJSON ? ord.toJSON() : ord,
        id,
      });
    }

    res.json({
      success: true,
      orders: updatedList,
    });
  } catch (err) {
    next(err);
  }
}

export async function getOrderById(req, res, next) {
  try {
    const { id } = req.params;
    const oRepo = getOrderRepo();
    let order = await oRepo.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    const ownerId = order.user?.toString() || order.user;
    if (ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this order.',
      });
    }

    // Refresh stage tracking
    order = updateOrderTracking(order);
    if (order.save) {
      await order.save();
    } else if (fallbackStore.orders.save) {
      await fallbackStore.orders.save(order);
    }

    const orderId = order._id ? order._id.toString() : order.id;

    res.json({
      success: true,
      order: {
        ...order.toJSON ? order.toJSON() : order,
        id: orderId,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function handleExtraDecision(req, res, next) {
  try {
    const { id, extraId } = req.params;
    const { action } = req.body; // 'approve' or 'decline'

    if (!action || !['approve', 'decline'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be either "approve" or "decline".',
      });
    }

    const oRepo = getOrderRepo();
    let order = await oRepo.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.',
      });
    }

    const ownerId = order.user?.toString() || order.user;
    if (ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this order.',
      });
    }

    // Find the extra item
    const extra = (order.extras || []).find(
      (e) => (e.extraId && e.extraId === extraId) || (e._id && e._id.toString() === extraId) || (e.id && e.id === extraId)
    );

    if (!extra) {
      return res.status(404).json({
        success: false,
        message: 'Extra work recommendation item not found.',
      });
    }

    if (extra.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: `This recommendation has already been marked as ${extra.status}.`,
      });
    }

    // Update status
    extra.status = action === 'approve' ? 'approved' : 'declined';
    extra.decidedAt = new Date();

    // Calculate pause time during inspection
    if (order.inspectionPromptedAt) {
      const pauseSec = Math.max(0, (Date.now() - new Date(order.inspectionPromptedAt).getTime()) / 1000);
      order.pausedDurationSeconds = (order.pausedDurationSeconds || 0) + pauseSec;
      order.inspectionDecisionAt = new Date();
    }

    // Append log entry
    if (action === 'approve') {
      order.log.push({
        type: 'extra_work',
        message: `Customer approved additional service: ${extra.reason} (+₹${extra.price.toLocaleString('en-IN')}). Final total updated.`,
        timestamp: new Date(),
      });
    } else {
      order.log.push({
        type: 'extra_work',
        message: `Customer declined additional service: ${extra.reason}. Locked price remains unchanged.`,
        timestamp: new Date(),
      });
    }

    // Re-run tracking to allow next stages to calculate smoothly
    order = updateOrderTracking(order);

    if (order.save) {
      await order.save();
    } else if (fallbackStore.orders.save) {
      await fallbackStore.orders.save(order);
    }

    const orderId = order._id ? order._id.toString() : order.id;

    res.json({
      success: true,
      message: `Extra work recommendation ${extra.status} successfully.`,
      order: {
        ...order.toJSON ? order.toJSON() : order,
        id: orderId,
      },
    });
  } catch (err) {
    next(err);
  }
}
