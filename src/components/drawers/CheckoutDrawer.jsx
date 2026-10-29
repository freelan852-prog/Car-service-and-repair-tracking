/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { formatINR } from '../../data/pricingData.js';
import {
  X,
  Car,
  Bike,
  Calendar,
  Clock,
  MapPin,
  Lock,
  CreditCard,
  User,
  Phone,
} from 'lucide-react';

export default function CheckoutDrawer() {
  const {
    drawers,
    closeDrawer,
    confirmBooking,
    activeVehicle,
    cart,
    cartTotal,
    cartSubtotal,
    cartGst,
    currentUser,
  } = useApp();

  const [pickupType, setPickupType] = useState('doorstep');
  const [address, setAddress] = useState('Flat 402, Green Glen Layout, Bellandur, Bengaluru');
  const [slotDate, setSlotDate] = useState('Tomorrow');
  const [slotTime, setSlotTime] = useState('09:30 AM - 10:30 AM');
  const [contactName, setContactName] = useState(currentUser?.name || '');
  const [contactPhone, setContactPhone] = useState(currentUser?.phone || '');

  React.useEffect(() => {
    if (currentUser?.name && !contactName) setContactName(currentUser.name);
    if (currentUser?.phone && !contactPhone) setContactPhone(currentUser.phone);
  }, [currentUser]);

  if (!drawers.checkout || !activeVehicle) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    confirmBooking({
      pickupType,
      address: pickupType === 'doorstep' ? address : 'Self-drop at AutoTrust Central Workshop',
      slotDate,
      slotTime,
      contactName,
      contactPhone,
    });
  };

  const dates = ['Tomorrow', 'Day After', 'In 3 Days'];
  const slots = [
    '09:30 AM - 10:30 AM',
    '11:30 AM - 12:30 PM',
    '02:00 PM - 03:00 PM',
    '04:30 PM - 05:30 PM',
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => closeDrawer('checkout')}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8F9FB]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0B1F3A] flex items-center justify-center text-white">
                <Lock className="w-4 h-4 text-[#14B8A6]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0B1F3A] font-heading">
                  Single-Sheet Checkout
                </h2>
                <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                  {activeVehicle.type === 'bike' ? (
                    <Bike className="w-3.5 h-3.5 text-[#14B8A6]" />
                  ) : (
                    <Car className="w-3.5 h-3.5 text-[#14B8A6]" />
                  )}
                  <span>
                    {activeVehicle.brand} {activeVehicle.model} ({activeVehicle.regNumber})
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => closeDrawer('checkout')}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0B1F3A] hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Section 1: Pickup / Drop-off Preference */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B1F3A]">
                1. Pickup & Handover
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPickupType('doorstep')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    pickupType === 'doorstep'
                      ? 'border-[#14B8A6] bg-[#F0FDFA] text-[#0B1F3A] ring-1 ring-[#14B8A6]'
                      : 'border-[#CBD5E1] hover:bg-slate-50 text-[#334155]'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#14B8A6]" />
                    <span>Doorstep Valet</span>
                  </div>
                  <div className="text-[11px] text-[#64748B] mt-1">
                    Free pickup & return delivery
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPickupType('self')}
                  className={`p-3 rounded-xl border text-left text-xs transition-all ${
                    pickupType === 'self'
                      ? 'border-[#14B8A6] bg-[#F0FDFA] text-[#0B1F3A] ring-1 ring-[#14B8A6]'
                      : 'border-[#CBD5E1] hover:bg-slate-50 text-[#334155]'
                  }`}
                >
                  <div className="font-bold flex items-center gap-1.5">
                    <Car className="w-3.5 h-3.5 text-[#14B8A6]" />
                    <span>Self-Drop</span>
                  </div>
                  <div className="text-[11px] text-[#64748B] mt-1">
                    Drop vehicle at workshop
                  </div>
                </button>
              </div>

              {pickupType === 'doorstep' && (
                <div className="pt-1">
                  <label className="block text-[11px] font-semibold text-[#475569] mb-1">
                    Pickup Street Address
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] focus:border-[#14B8A6] focus:ring-1 focus:ring-[#14B8A6] outline-none"
                    placeholder="Enter complete building & street address"
                    required
                  />
                </div>
              )}
            </div>

            {/* Section 2: Preferred Service Schedule */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B1F3A]">
                2. Service Schedule
              </label>

              {/* Date selection */}
              <div>
                <span className="block text-[11px] text-[#64748B] mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-[#14B8A6]" />
                  Service Date
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {dates.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setSlotDate(d)}
                      className={`py-2 px-2.5 rounded-lg border text-xs font-semibold text-center transition-all ${
                        slotDate === d
                          ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white shadow-xs'
                          : 'border-[#CBD5E1] text-[#334155] hover:bg-slate-50'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time slot selection */}
              <div>
                <span className="block text-[11px] text-[#64748B] mb-1.5 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#14B8A6]" />
                  Arrival Window
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {slots.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSlotTime(s)}
                      className={`py-2 px-2.5 rounded-lg border text-xs font-medium text-center transition-all ${
                        slotTime === s
                          ? 'border-[#14B8A6] bg-[#14B8A6] text-white shadow-xs'
                          : 'border-[#CBD5E1] text-[#334155] hover:bg-slate-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 3: Customer Contact */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B1F3A]">
                3. Customer Contact
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-[#64748B] mb-1 flex items-center gap-1">
                    <User className="w-3 h-3 text-[#14B8A6]" />
                    Name
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] focus:border-[#14B8A6] outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-[#64748B] mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#14B8A6]" />
                    Mobile
                  </label>
                  <input
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] focus:border-[#14B8A6] outline-none font-mono"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Section 4: Payment Terms: Pay After Service ONLY */}
            <div className="p-4 rounded-xl border border-[#CBD5E1] bg-[#F8F9FB] space-y-2">
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#0B1F3A]" />
                <span className="text-xs font-bold text-[#0B1F3A]">
                  Payment Terms: Pay After Service Only
                </span>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed">
                Zero advance payment required. Inspect your vehicle upon completion and settle via Cash, UPI, or Card at the workshop or with the delivery driver.
              </p>
            </div>

            {/* Section 5: Order Breakdown & Locked Price */}
            <div className="p-4 rounded-xl bg-slate-900 text-white space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-700">
                <span>Selected Services ({cart.length} items)</span>
                <span className="font-mono">{formatINR(cartSubtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-300 pb-2 border-b border-slate-700">
                <span>Applicable GST (18%)</span>
                <span className="font-mono">{formatINR(cartGst)}</span>
              </div>
              <div className="flex items-baseline justify-between pt-1">
                <div>
                  <div className="text-xs font-semibold text-[#14B8A6] uppercase tracking-wider flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Locked Price Guarantee
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    Locks at confirmation
                  </div>
                </div>
                <div className="text-xl font-bold font-heading text-white tabular-nums">
                  {formatINR(cartTotal)}
                </div>
              </div>
            </div>

            {/* Confirm & Lock Price Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-xl bg-[#14B8A6] hover:bg-[#0d9488] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
              >
                <Lock className="w-4 h-4" />
                <span>Confirm Booking & Lock Price ({formatINR(cartTotal)})</span>
              </button>
              <p className="text-center text-[10px] text-[#64748B] mt-2">
                By confirming, this price is permanently locked. Any workshop findings require your explicit authorization.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
