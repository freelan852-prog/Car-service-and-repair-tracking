/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import {
  formatINR,
  PRICING_CONFIG,
  calculateServicePrice,
  getVehicleModelTierInfo,
} from '../data/pricingData.js';
import {
  Car,
  Bike,
  Lock,
  ArrowRight,
  ShieldCheck,
  Clock,
  ChevronRight,
  Activity,
  Plus,
  Calendar,
  MapPin,
  CheckCircle2,
  FileText,
  AlertTriangle,
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const {
    activeVehicle,
    openDrawer,
    bookings,
    catalogServices,
    addToCart,
    cart,
  } = useApp();

  if (!activeVehicle) return null;

  const typeConfig = PRICING_CONFIG.categories[activeVehicle.type] || PRICING_CONFIG.categories.car;
  const modelTierInfo = getVehicleModelTierInfo(activeVehicle);
  const fuelLabel = PRICING_CONFIG.fuels[activeVehicle.fuel]?.label || activeVehicle.fuel;

  const topServices = catalogServices.slice(0, 3);

  // Status Chip styling helper
  const getStatusChipClass = (stageName) => {
    switch (stageName) {
      case 'Booked':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Vehicle received':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Inspection':
        return 'bg-amber-50 text-amber-800 border-amber-300 font-bold animate-pulse';
      case 'In progress':
        return 'bg-teal-50 text-teal-700 border-teal-300';
      case 'Ready':
        return 'bg-emerald-50 text-emerald-800 border-emerald-300';
      case 'Delivered':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-12 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E6F4F1] border border-[#B3E5DF] text-xs font-semibold text-[#006B5F]">
              <Lock className="w-3.5 h-3.5 text-[#14B8A6]" />
              <span>Locked Price Guarantee · Pay After Service</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B1F3A] font-heading tracking-tight leading-[1.15]">
              Locked Price. <br />
              <span className="text-[#14B8A6]">Zero Garage Surprises.</span>
            </h1>

            <p className="text-sm sm:text-base text-[#334155] leading-relaxed max-w-xl">
              Transparent maintenance calibrated directly to your registered{' '}
              <strong>{activeVehicle.type === 'bike' ? 'motorcycle' : 'car'}</strong> and fuel specification. Review upfront pricing, lock your rate at booking confirmation, and pay only after completion at the workshop.
            </p>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => navigate('/services')}
                className="px-6 py-3.5 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md transition-all active:scale-[0.99]"
              >
                <span>Browse {activeVehicle.type === 'bike' ? 'Bike' : 'Car'} Services</span>
                <ArrowRight className="w-4 h-4 text-[#14B8A6]" />
              </button>
            </div>
          </div>

          {/* Right Column: Active Vehicle Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl p-6 shadow-xl border border-[#E2E8F0] space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#0B1F3A] flex items-center justify-center text-white">
                    {activeVehicle.type === 'bike' ? (
                      <Bike className="w-5 h-5 text-[#14B8A6]" />
                    ) : (
                      <Car className="w-5 h-5 text-[#14B8A6]" />
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-[#64748B]">
                      Active Selected Vehicle
                    </div>
                    <div className="text-base font-bold text-[#0B1F3A] font-heading">
                      {activeVehicle.brand} {activeVehicle.model}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => openDrawer('car')}
                  className="text-xs font-semibold text-[#006B5F] hover:text-[#0B1F3A]"
                >
                  Manage
                </button>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-[#F8F9FB] border border-slate-200">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">
                    Model Segment
                  </span>
                  <span className="font-bold text-[#0B1F3A] mt-0.5 block truncate" title={modelTierInfo.label}>
                    {modelTierInfo.label}
                  </span>
                  <span className="text-[10px] text-[#006B5F] font-semibold mt-0.5 block">
                    {modelTierInfo.multiplier}x model multiplier
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-[#F8F9FB] border border-slate-200">
                  <span className="text-[#64748B] block text-[10px] uppercase font-bold">
                    Fuel Spec
                  </span>
                  <span className="font-bold text-[#0B1F3A] capitalize mt-0.5 block">
                    {fuelLabel}
                  </span>
                  <span className="text-[10px] text-[#64748B] mt-0.5 block capitalize">
                    {activeVehicle.type} calibration
                  </span>
                </div>
              </div>

              {/* Registration Plate */}
              <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block">
                    Registration Plate
                  </span>
                  <span className="font-mono font-bold tracking-widest text-sm text-white uppercase">
                    {activeVehicle.regNumber}
                  </span>
                </div>
                <span className="text-[11px] text-[#14B8A6] font-semibold">
                  Year {activeVehicle.year}
                </span>
              </div>

              <button
                onClick={() => navigate('/services')}
                className="w-full py-2.5 px-3 rounded-xl bg-[#14B8A6] hover:bg-[#0d9488] text-white text-xs font-bold flex items-center justify-center gap-1 transition-all"
              >
                <span>View Tailored Rates</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Your Bookings Section (With Real Empty State & Compact Status Chips) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] font-heading">
              Your Service Bookings
            </h2>
            <p className="text-xs text-[#64748B] mt-0.5">
              Live status tracking, locked estimates, and inspection findings
            </p>
          </div>
        </div>

        {bookings.length === 0 ? (
          /* EMPTY STATE (Mandatory requirement: No fake reviews/bookings) */
          <div className="p-8 sm:p-12 rounded-2xl bg-white border border-[#E2E8F0] text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-[#0B1F3A]">
              No bookings yet. Book your first service
            </h3>
            <p className="text-xs text-[#64748B] max-w-sm mx-auto leading-relaxed">
              Choose from periodic maintenance, fluid overhauls, or brake inspections calibrated for your {activeVehicle.brand} {activeVehicle.model}.
            </p>
            <button
              onClick={() => navigate('/services')}
              className="mt-2 px-5 py-2.5 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white text-xs font-bold transition-all shadow-sm"
            >
              Browse Services
            </button>
          </div>
        ) : (
          /* Real Bookings List with Compact Status Chips */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookings.map((booking) => {
              const chipClass = getStatusChipClass(booking.stageName);
              const hasPendingExtra =
                booking.extraWork && booking.extraWork.status === 'pending';

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl p-5 border border-[#CBD5E1] shadow-xs hover:border-[#14B8A6] hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div>
                    {/* Top Row: Booking ID and Compact Status Chip */}
                    <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                      <span className="font-mono text-xs font-bold text-[#0B1F3A]">
                        #{booking.id}
                      </span>

                      {/* COMPACT STATUS CHIP FOR QUICK GLANCE */}
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border font-semibold flex items-center gap-1.5 ${chipClass}`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        <span>{booking.stageName}</span>
                      </span>
                    </div>

                    {/* Vehicle Details */}
                    <div className="mt-3">
                      <div className="text-sm font-bold text-[#0B1F3A] font-heading">
                        {booking.vehicle?.brand} {booking.vehicle?.model}
                      </div>
                      <div className="text-xs font-mono text-[#64748B] uppercase">
                        {booking.vehicle?.regNumber || booking.vehicle?.regNo}
                      </div>
                    </div>

                    {/* Pending Action Alert if paused at Inspection */}
                    {hasPendingExtra && (
                      <div className="mt-3 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold">Inspection Finding:</div>
                          <div className="text-[11px] leading-tight mt-0.5">
                            {booking.extraWork.reason} ({formatINR(booking.extraWork.price)})
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Schedule Details */}
                    <div className="mt-3 space-y-1 text-xs text-[#64748B]">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-[#14B8A6]" />
                        <span>
                          {booking.slotDate} · {booking.slotTime}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#14B8A6]" />
                        <span className="truncate">{booking.address}</span>
                      </div>
                    </div>
                  </div>

                  {/* Price & Open Tracker Button */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-[#64748B] block">
                        Locked Total
                      </span>
                      <span className="text-base font-bold text-[#0B1F3A] font-heading tabular-nums">
                        {formatINR(booking.finalPayable)}
                      </span>
                    </div>

                    <button
                      onClick={() => openDrawer('tracker', booking.id)}
                      className="px-3.5 py-2 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                    >
                      <Activity className="w-3.5 h-3.5 text-[#14B8A6]" />
                      <span>Open Tracker</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Featured Service Packages (Matching Car or Bike) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-[#006B5F]">
              Tailored Service Catalog
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] font-heading mt-0.5">
              Popular Packages for {activeVehicle.brand} {activeVehicle.model}
            </h2>
          </div>
          <button
            onClick={() => navigate('/services')}
            className="text-xs font-bold text-[#0B1F3A] hover:text-[#14B8A6] flex items-center gap-1"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {topServices.map((service) => {
            const calculatedPrice = calculateServicePrice(
              service.basePrice,
              activeVehicle
            );
            const inCart = cart.some((i) => i.serviceId === service.id);

            return (
              <div
                key={service.id}
                className="bg-white rounded-2xl p-5 border border-[#E2E8F0] hover:border-[#14B8A6] hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-[#006B5F] bg-[#E6F4F1] px-2 py-0.5 rounded-full">
                      {service.categoryName}
                    </span>
                    <span className="text-xs text-[#64748B] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {service.durationHours} hrs
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#0B1F3A] font-heading">
                    {service.name}
                  </h3>
                  <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                    {service.shortDesc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-base font-bold text-[#0B1F3A] font-heading tabular-nums">
                    {formatINR(calculatedPrice)}
                  </div>

                  <button
                    onClick={() => {
                      addToCart(service);
                      openDrawer('cart');
                    }}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                      inCart
                        ? 'bg-[#E6F4F1] text-[#006B5F]'
                        : 'bg-[#0B1F3A] hover:bg-[#132B4F] text-white shadow-xs'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{inCart ? 'Added' : 'Add'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
