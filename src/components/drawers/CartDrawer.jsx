/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { formatINR } from '../../data/pricingData.js';
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Car,
  Bike,
} from 'lucide-react';

export default function CartDrawer() {
  const {
    drawers,
    closeDrawer,
    openDrawer,
    cart,
    cartCount,
    cartSubtotal,
    cartGst,
    cartTotal,
    updateCartQty,
    removeFromCart,
    activeVehicle,
  } = useApp();

  if (!drawers.cart || !activeVehicle) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => closeDrawer('cart')}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8F9FB]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0B1F3A] flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4 text-[#14B8A6]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0B1F3A] font-heading">
                  Service Estimate
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
              onClick={() => closeDrawer('cart')}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0B1F3A] hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-12 px-4">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-400">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-semibold text-[#0B1F3A]">
                  Your estimate cart is empty
                </h3>
                <p className="text-xs text-[#64748B] mt-1 max-w-xs mx-auto">
                  Browse our service catalog for your {activeVehicle.brand} {activeVehicle.model}.
                </p>
                <button
                  onClick={() => closeDrawer('cart')}
                  className="mt-4 px-4 py-2 rounded-lg bg-[#0B1F3A] text-white text-xs font-semibold hover:bg-[#132B4F] transition-colors"
                >
                  Browse Services
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.serviceId}
                      className="p-3.5 rounded-xl border border-[#E2E8F0] bg-white hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-[#0B1F3A] leading-snug">
                            {item.name}
                          </h4>
                          <span className="text-[11px] text-[#64748B] capitalize">
                            {item.category}
                          </span>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.serviceId)}
                          className="text-[#94A3B8] hover:text-[#DC2626] p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                        {/* Quantity Stepper */}
                        <div className="flex items-center gap-2 border border-[#CBD5E1] rounded-lg px-2 py-1">
                          <button
                            onClick={() => updateCartQty(item.serviceId, -1)}
                            className="text-[#64748B] hover:text-[#0B1F3A] p-0.5"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-[#0B1F3A] w-4 text-center tabular-nums">
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateCartQty(item.serviceId, 1)}
                            className="text-[#64748B] hover:text-[#0B1F3A] p-0.5"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-sm font-bold text-[#0B1F3A] font-heading tabular-nums">
                            {formatINR(item.calculatedPrice * item.qty)}
                          </div>
                          {item.qty > 1 && (
                            <div className="text-[10px] text-[#64748B] tabular-nums">
                              {formatINR(item.calculatedPrice)} each
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Lock Guarantee Callout */}
                <div className="p-3.5 rounded-xl bg-[#F0FDFA] border border-[#CCFBF1] text-xs text-[#0F766E] flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-[#006B5F]">
                      Locked Price Guarantee
                    </div>
                    <div className="text-[11px] text-[#115E59] mt-0.5 leading-relaxed">
                      This price permanently locks when you confirm your booking. Pay after service at the workshop.
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer with Summary and Checkout Button */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-[#E2E8F0] bg-[#F8F9FB] space-y-3">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#475569]">
                  <span>Services Subtotal ({cartCount} items)</span>
                  <span className="font-medium text-[#0B1F3A] tabular-nums">
                    {formatINR(cartSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-[#475569]">
                  <span>GST (Standard 18%)</span>
                  <span className="font-medium text-[#0B1F3A] tabular-nums">
                    {formatINR(cartGst)}
                  </span>
                </div>
                <div className="pt-2 border-t border-[#CBD5E1] flex justify-between items-baseline">
                  <div>
                    <span className="text-sm font-bold text-[#0B1F3A]">
                      Locked Estimate
                    </span>
                    <span className="block text-[10px] text-[#64748B]">
                      Pay after service at workshop
                    </span>
                  </div>
                  <span className="text-lg font-bold text-[#0B1F3A] font-heading tabular-nums">
                    {formatINR(cartTotal)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => openDrawer('checkout')}
                className="w-full py-3 px-4 rounded-xl bg-[#14B8A6] hover:bg-[#0d9488] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all transform active:scale-[0.99]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
