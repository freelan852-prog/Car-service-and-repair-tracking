/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose from 'mongoose';

const OrderItemSchema = new mongoose.Schema(
  {
    serviceId: { type: String, required: true },
    name: { type: String, required: true },
    lockedPrice: { type: Number, required: true },
    category: { type: String },
    durationHours: { type: Number },
  },
  { _id: false }
);

const ExtraWorkSchema = new mongoose.Schema(
  {
    extraId: { type: String, required: true },
    reason: { type: String, required: true },
    component: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'declined'],
      default: 'pending',
    },
    photoPlaceholder: {
      type: { type: String },
      caption: { type: String },
      label: { type: String },
    },
    createdAt: { type: Date, default: Date.now },
    decidedAt: { type: Date },
  },
  { _id: true }
);

const LogEntrySchema = new mongoose.Schema(
  {
    type: { type: String, default: 'status' },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    vehicle: {
      vehicleId: { type: String },
      type: { type: String, enum: ['car', 'bike'], required: true },
      brand: { type: String, required: true },
      model: { type: String, required: true },
      segment: { type: String, required: true },
      fuel: { type: String, required: true },
      year: { type: Number, required: true },
      regNo: { type: String, required: true },
    },
    items: [OrderItemSchema],
    lockedTotal: { type: Number, required: true },
    pickupOption: { type: String, enum: ['pickup', 'self'], default: 'pickup' },
    slot: { type: String, required: true },
    address: { type: String, default: '' },
    paymentMode: { type: String, default: 'pay_after_service' },
    status: {
      type: String,
      enum: ['Booked', 'Vehicle received', 'Inspection', 'In progress', 'Ready', 'Delivered', 'Cancelled'],
      default: 'Booked',
    },
    startedAt: { type: Date, default: Date.now },
    pausedDurationSeconds: { type: Number, default: 0 },
    inspectionPromptedAt: { type: Date },
    inspectionDecisionAt: { type: Date },
    extras: [ExtraWorkSchema],
    log: [LogEntrySchema],
    finalTotal: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

OrderSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret.__v;
    return ret;
  },
});

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
