/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Vehicle } from '../models/Vehicle.js';
import { fallbackStore } from '../utils/dataStore.js';
import { isConnected } from '../config/db.js';

function getRepo() {
  return isConnected() ? Vehicle : fallbackStore.vehicles;
}

export async function getVehicles(req, res, next) {
  try {
    const repo = getRepo();
    const list = await repo.find({ user: req.user.id });

    // Format list
    const vehicles = list.map((v) => {
      const id = v._id ? v._id.toString() : v.id;
      return {
        id,
        _id: id,
        type: v.type,
        brand: v.brand,
        model: v.model,
        segment: v.segment,
        fuel: v.fuel,
        year: v.year,
        regNo: v.regNo,
      };
    });

    res.json({ success: true, vehicles });
  } catch (err) {
    next(err);
  }
}

export async function createVehicle(req, res, next) {
  try {
    const { type, brand, model, segment, fuel, year, regNo } = req.body;

    if (!type || !brand || !model || !segment || !fuel || !year || !regNo) {
      return res.status(400).json({
        success: false,
        message: 'All vehicle fields (type, brand, model, segment, fuel, year, regNo) are required.',
      });
    }

    const cleanRegNo = regNo.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleanRegNo.length < 4) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid registration number.',
      });
    }

    const repo = getRepo();

    // Check unique regNo for this user
    const existing = await repo.findOne({ user: req.user.id, regNo: cleanRegNo });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: `Vehicle with registration ${cleanRegNo} is already registered under your account.`,
      });
    }

    const vehicle = await repo.create({
      user: req.user.id,
      type: type === 'bike' ? 'bike' : 'car',
      brand: brand.trim(),
      model: model.trim(),
      segment: segment.trim().toLowerCase(),
      fuel: fuel.trim().toLowerCase(),
      year: parseInt(year, 10),
      regNo: cleanRegNo,
    });

    const id = vehicle._id ? vehicle._id.toString() : vehicle.id;

    res.status(201).json({
      success: true,
      message: 'Vehicle added successfully.',
      vehicle: {
        id,
        _id: id,
        type: vehicle.type,
        brand: vehicle.brand,
        model: vehicle.model,
        segment: vehicle.segment,
        fuel: vehicle.fuel,
        year: vehicle.year,
        regNo: vehicle.regNo,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function updateVehicle(req, res, next) {
  try {
    const { id } = req.params;
    const { type, brand, model, segment, fuel, year, regNo } = req.body;

    const repo = getRepo();
    const vehicle = await repo.findById(id);

    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    }

    const ownerId = vehicle.user?.toString() || vehicle.user;
    if (ownerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to modify this vehicle.' });
    }

    const updateData = {};
    if (type) updateData.type = type === 'bike' ? 'bike' : 'car';
    if (brand) updateData.brand = brand.trim();
    if (model) updateData.model = model.trim();
    if (segment) updateData.segment = segment.trim().toLowerCase();
    if (fuel) updateData.fuel = fuel.trim().toLowerCase();
    if (year) updateData.year = parseInt(year, 10);
    if (regNo) {
      const cleanRegNo = regNo.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
      const existing = await repo.findOne({ user: req.user.id, regNo: cleanRegNo });
      const existingId = existing ? (existing._id ? existing._id.toString() : existing.id) : null;
      if (existing && existingId !== id) {
        return res.status(409).json({
          success: false,
          message: `Another vehicle already has registration number ${cleanRegNo}.`,
        });
      }
      updateData.regNo = cleanRegNo;
    }

    const updated = await repo.findByIdAndUpdate(id, updateData, { new: true });
    const updatedId = updated._id ? updated._id.toString() : updated.id;

    res.json({
      success: true,
      message: 'Vehicle updated successfully.',
      vehicle: {
        id: updatedId,
        _id: updatedId,
        type: updated.type,
        brand: updated.brand,
        model: updated.model,
        segment: updated.segment,
        fuel: updated.fuel,
        year: updated.year,
        regNo: updated.regNo,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteVehicle(req, res, next) {
  try {
    const { id } = req.params;
    const repo = getRepo();

    const vehicle = await repo.findById(id);
    if (!vehicle) {
      return res.status(404).json({ success: false, message: 'Vehicle not found.' });
    }

    const ownerId = vehicle.user?.toString() || vehicle.user;
    if (ownerId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this vehicle.' });
    }

    await repo.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Vehicle deleted successfully.',
      deletedId: id,
    });
  } catch (err) {
    next(err);
  }
}
