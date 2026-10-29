/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import {
  calculateServicePrice,
  formatINR,
  PRICING_CONFIG,
  getVehicleModelTierInfo,
} from '../data/pricingData.js';
import {
  Car,
  Bike,
  Fuel,
  Plus,
  Check,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle,
} from 'lucide-react';

export default function ServicesPage() {
  const {
    activeVehicle,
    openDrawer,
    addToCart,
    cart,
    cartCount,
    cartTotal,
    cartSubtotal,
    cartGst,
    catalogServices,
  } = useApp();

  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  if (!activeVehicle) return null;

  const modelTierInfo = getVehicleModelTierInfo(activeVehicle);
  const fuelLabel = PRICING_CONFIG.fuels[activeVehicle.fuel]?.label || activeVehicle.fuel;

  // Extract unique categories present in the current catalog
  const uniqueCategories = [
    { id: 'all', label: 'All Services' },
    ...Array.from(new Set(catalogServices.map((s) => s.category))).map((catKey) => {
      const match = catalogServices.find((s) => s.category === catKey);
      return { id: catKey, label: match ? match.categoryName : catKey };
    }),
  ];

  const filteredServices = catalogServices.filter((item) => {
    if (activeCategoryFilter === 'all') return true;
    return item.category === activeCategoryFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Prominent Vehicle & Model Calibration Banner */}
      <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#0B1F3A] flex items-center justify-center text-white shrink-0">
            {activeVehicle.type === 'bike' ? (
              <Bike className="w-6 h-6 text-[#14B8A6]" />
            ) : (
              <Car className="w-6 h-6 text-[#14B8A6]" />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-[#0B1F3A] font-heading">
                Pricing for: {activeVehicle.brand} {activeVehicle.model}
              </h2>
              {/* Registration Plate */}
              <span className="text-xs font-mono font-bold uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded">
                {activeVehicle.regNumber}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#64748B] mt-1">
              <span>
                Model Class:{' '}
                <strong className="text-[#0B1F3A]">{modelTierInfo.label}</strong>{' '}
                <span className="text-[#006B5F] font-semibold">({modelTierInfo.multiplier}x model rate)</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-[#14B8A6]" />
                Fuel: <strong>{fuelLabel}</strong>
              </span>
              <span>·</span>
              <span>Year {activeVehicle.year}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => openDrawer('car')}
          className="px-4 py-2 rounded-xl border border-[#CBD5E1] hover:border-[#14B8A6] bg-[#F8F9FB] hover:bg-white text-xs font-semibold text-[#0B1F3A] transition-colors self-end md:self-auto"
        >
          Switch or Edit Vehicle
        </button>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {uniqueCategories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategoryFilter(cat.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all ${
              activeCategoryFilter === cat.id
                ? 'bg-[#0B1F3A] text-white shadow-sm'
                : 'bg-white border border-[#E2E8F0] text-[#475569] hover:bg-slate-50 hover:text-[#0B1F3A]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Main Catalog & Sticky Sidebar (7:5 Split) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Services Grid (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="flex items-center justify-between text-xs text-[#64748B]">
            <span>
              Showing {filteredServices.length} packages calibrated for {activeVehicle.model} ({modelTierInfo.label})
            </span>
            <span className="text-[11px] font-semibold text-[#006B5F] bg-[#E6F4F1] px-2.5 py-0.5 rounded-full">
              Transparent Parts & Labor
            </span>
          </div>

          <div className="space-y-4">
            {filteredServices.map((service) => {
              const calculatedPrice =
                service.calculatedPrice ??
                calculateServicePrice(service.basePrice, activeVehicle);
              const inCartItem = cart.find((i) => i.serviceId === service.id);

              return (
                <div
                  key={service.id}
                  className="bg-white rounded-2xl p-6 border border-[#E2E8F0] hover:border-[#14B8A6] hover:shadow-md transition-all space-y-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[11px] font-bold text-[#006B5F] bg-[#E6F4F1] px-2 py-0.5 rounded-full">
                          {service.categoryName}
                        </span>
                        <span className="text-xs text-[#64748B] flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {service.durationHours} hrs
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#0B1F3A] font-heading">
                        {service.name}
                      </h3>
                      <p className="text-xs text-[#475569] mt-1 leading-relaxed">
                        {service.shortDesc}
                      </p>
                    </div>

                    {/* Price Block */}
                    <div className="text-right shrink-0">
                      <div className="text-xl font-bold text-[#0B1F3A] font-heading tabular-nums">
                        {formatINR(calculatedPrice)}
                      </div>
                      <span className="text-[10px] text-[#006B5F] font-semibold block">
                        Locked rate
                      </span>
                    </div>
                  </div>

                  {/* Inclusions List */}
                  <div className="pt-3 border-t border-slate-100">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#64748B] mb-2">
                      Package Inclusions:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#334155]">
                      {service.inclusions.map((inc, idx) => (
                        <div key={idx} className="flex items-start gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-[#14B8A6] shrink-0 mt-0.5" />
                          <span className="text-[11px] leading-tight">{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-[#64748B]">
                      Interval: {service.recommendedKm}
                    </span>

                    <button
                      onClick={() => addToCart(service)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                        inCartItem
                          ? 'bg-[#E6F4F1] text-[#006B5F] border border-[#B3E5DF]'
                          : 'bg-[#0B1F3A] hover:bg-[#132B4F] text-white shadow-xs'
                      }`}
                    >
                      {inCartItem ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-[#006B5F]" />
                          <span>Added ({inCartItem.qty})</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add to Estimate</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Sticky Estimate Breakdown (5 Cols) */}
        <div className="hidden lg:block lg:col-span-5 sticky top-24">
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-lg space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-[#14B8A6]" />
                <h3 className="text-base font-bold text-[#0B1F3A] font-heading">
                  Estimate Breakdown
                </h3>
              </div>
              <span className="text-xs text-[#64748B]">
                {cartCount} item(s)
              </span>
            </div>

            {/* Vehicle Details in Cart */}
            <div className="p-3 rounded-xl bg-[#F8F9FB] border border-slate-200 text-xs">
              <span className="text-[10px] text-[#64748B] uppercase font-bold block">
                Target Vehicle
              </span>
              <div className="font-bold text-[#0B1F3A] mt-0.5">
                {activeVehicle.brand} {activeVehicle.model}
              </div>
              <div className="text-[11px] font-mono text-[#475569] uppercase mt-0.5">
                {activeVehicle.regNumber}
              </div>
            </div>

            {/* Cart Items */}
            {cart.length === 0 ? (
              <div className="text-center py-6 text-xs text-[#64748B]">
                <p>No services in your estimate cart yet.</p>
                <p className="mt-1 text-[11px]">Select packages from the left to calculate your locked estimate.</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div
                    key={item.serviceId}
                    className="flex items-start justify-between text-xs py-2 border-b border-slate-100"
                  >
                    <div>
                      <div className="font-semibold text-[#0B1F3A]">{item.name}</div>
                      <div className="text-[10px] text-[#64748B]">
                        Qty: {item.qty} × {formatINR(item.calculatedPrice)}
                      </div>
                    </div>
                    <div className="font-bold text-[#0B1F3A] tabular-nums">
                      {formatINR(item.calculatedPrice * item.qty)}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Total Calculations */}
            <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
              <div className="flex justify-between text-[#475569]">
                <span>Services Subtotal</span>
                <span className="font-medium text-[#0B1F3A] tabular-nums">{formatINR(cartSubtotal)}</span>
              </div>
              <div className="flex justify-between text-[#475569]">
                <span>Applicable GST (18%)</span>
                <span className="font-medium text-[#0B1F3A] tabular-nums">{formatINR(cartGst)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-[#0B1F3A]">Locked Estimate</span>
                  <span className="block text-[10px] text-[#64748B]">Locks upon booking confirmation</span>
                </div>
                <span className="text-xl font-bold text-[#0B1F3A] font-heading tabular-nums">
                  {formatINR(cartTotal)}
                </span>
              </div>
            </div>

            {/* Trust Notice */}
            <div className="p-3.5 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] text-xs text-[#0F766E] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" />
              <div className="text-[11px] leading-relaxed">
                <strong>Pay after service at workshop.</strong> No advance payment needed.
              </div>
            </div>

            {/* Checkout Action */}
            <button
              onClick={() => openDrawer('checkout')}
              disabled={cart.length === 0}
              className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all ${
                cart.length > 0
                  ? 'bg-[#14B8A6] hover:bg-[#0d9488] text-white cursor-pointer active:scale-[0.99]'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-[#CBD5E1] p-3 shadow-lg flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#64748B] block">
            {cartCount} item(s) · {activeVehicle.regNumber}
          </span>
          <span className="text-base font-bold text-[#0B1F3A] font-heading tabular-nums">
            {formatINR(cartTotal)}
          </span>
        </div>

        <button
          onClick={() => openDrawer('cart')}
          className="px-5 py-2.5 rounded-xl bg-[#14B8A6] text-white text-xs font-bold flex items-center gap-1.5 shadow-sm"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>View Estimate & Checkout</span>
        </button>
      </div>
    </div>
  );
}
