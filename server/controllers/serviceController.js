/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Vehicle } from '../models/Vehicle.js';
import { fallbackStore } from '../utils/dataStore.js';
import { isConnected } from '../config/db.js';
import { getServicesForVehicle, PRICING_TABLE } from '../config/pricing.js';

function getVehicleRepo() {
  return isConnected() ? Vehicle : fallbackStore.vehicles;
}

export async function getServices(req, res, next) {
  try {
    const { vehicleId } = req.query;

    if (!vehicleId) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter vehicleId is required to calculate personalized vehicle service pricing.',
      });
    }

    const repo = getVehicleRepo();
    const vehicle = await repo.findById(vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        message: 'Vehicle not found.',
      });
    }

    const ownerId = vehicle.user?.toString() || vehicle.user;
    if (ownerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to vehicle pricing.',
      });
    }

    const services = getServicesForVehicle(vehicle);

    const vehicleSnapshot = {
      id: vehicle._id ? vehicle._id.toString() : vehicle.id,
      type: vehicle.type,
      brand: vehicle.brand,
      model: vehicle.model,
      segment: vehicle.segment,
      fuel: vehicle.fuel,
      year: vehicle.year,
      regNo: vehicle.regNo,
    };

    res.json({
      success: true,
      vehicle: vehicleSnapshot,
      pricingRules: {
        segment: vehicle.segment,
        fuel: vehicle.fuel,
        segmentMultiplier:
          (PRICING_TABLE.segments[vehicle.type] || {})[vehicle.segment]?.multiplier || 1.0,
        fuelMultiplier: PRICING_TABLE.fuels[vehicle.fuel]?.multiplier || 1.0,
      },
      services,
    });
  } catch (err) {
    next(err);
  }
}
