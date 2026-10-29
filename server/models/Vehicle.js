/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    type: {
      type: String,
      enum: ['car', 'bike'],
      required: [true, 'Vehicle type (car/bike) is required'],
    },
    brand: {
      type: String,
      required: [true, 'Vehicle brand is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true,
    },
    segment: {
      type: String,
      required: [true, 'Vehicle segment is required'],
      enum: ['hatchback', 'sedan', 'suv', 'commuter', 'sports'],
    },
    fuel: {
      type: String,
      required: [true, 'Fuel specification is required'],
      enum: ['petrol', 'diesel', 'cng', 'electric'],
    },
    year: {
      type: Number,
      required: [true, 'Manufacturing year is required'],
    },
    regNo: {
      type: String,
      required: [true, 'Registration number is required'],
      trim: true,
      uppercase: true,
    },
  },
  {
    timestamps: true,
  }
);

vehicleSchema.index({ user: 1, regNo: 1 }, { unique: true });

vehicleSchema.virtual('id').get(function () {
  return this._id.toHexString();
});
vehicleSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

export const Vehicle = mongoose.models.Vehicle || mongoose.model('Vehicle', vehicleSchema);
