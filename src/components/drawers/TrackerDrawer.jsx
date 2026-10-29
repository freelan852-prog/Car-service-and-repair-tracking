/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  TRACKER_STAGES,
  TRACKER_STAGE_INTERVAL_MS,
  formatINR,
} from '../../data/pricingData.js';
import {
  X,
  Lock,
  CheckCircle,
  Car,
  Bike,
  AlertTriangle,
  Clock,
  Camera,
  Check,
  Ban,
  Calendar,
  MapPin,
  ListOrdered,
  PauseCircle,
  PlayCircle,
} from 'lucide-react';

export default function TrackerDrawer() {
  const {
    drawers,
    closeDrawer,
    activeTrackerBooking,
    approveExtraWork,
    declineExtraWork,
  } = useApp();

  if (!drawers.tracker || !activeTrackerBooking) return null;

  const booking = activeTrackerBooking;
  const currentStageIndex = booking.stageIndex;
  const currentStageName = booking.stageName;
  const isDelivered = currentStageIndex === TRACKER_STAGES.length - 1;
  const isPendingExtra = booking.extraWork && booking.extraWork.status === 'pending';

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => closeDrawer('tracker')}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8F9FB]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#0B1F3A] flex items-center justify-center text-white shadow-sm">
                {booking.vehicle?.type === 'bike' ? (
                  <Bike className="w-5 h-5 text-[#14B8A6]" />
                ) : (
                  <Car className="w-5 h-5 text-[#14B8A6]" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#0B1F3A] font-heading">
                    Workshop Bay Tracking
                  </h2>
                  <span className="text-xs font-mono bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-bold">
                    #{booking.id}
                  </span>
                </div>
                <div className="text-xs text-[#64748B]">
                  {booking.vehicle?.brand} {booking.vehicle?.model} ·{' '}
                  <span className="font-mono uppercase font-semibold">
                    {booking.vehicle?.regNumber || booking.vehicle?.regNo}
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => closeDrawer('tracker')}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0B1F3A] hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Automatic Progress Status Bar */}
          <div className="bg-[#0B1F3A] px-6 py-3 flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-2">
              {isPendingExtra ? (
                <>
                  <PauseCircle className="w-4 h-4 text-amber-400 animate-pulse" />
                  <span className="text-amber-300 font-semibold">
                    Timeline Paused · Decision Required
                  </span>
                </>
              ) : isDelivered ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold">
                    Service Complete & Delivered
                  </span>
                </>
              ) : (
                <>
                  <Clock className="w-4 h-4 text-[#14B8A6] animate-spin" />
                  <span className="text-slate-200 font-medium">
                    Auto-advancing ({TRACKER_STAGE_INTERVAL_MS / 1000}s interval)
                  </span>
                </>
              )}
            </div>

            <span className="font-mono text-[11px] text-slate-400">
              Stage {currentStageIndex + 1} of {TRACKER_STAGES.length}
            </span>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Locked Price Guarantee Banner */}
            <div className="p-4 rounded-xl bg-[#F0FDFA] border-l-4 border-l-[#14B8A6] border border-[#CCFBF1] shadow-xs">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-[#14B8A6] text-white flex items-center justify-center shrink-0 mt-0.5">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#006B5F]">
                      Price Lock Guarantee
                    </h3>
                    <p className="text-xs text-[#0F766E] mt-0.5">
                      Base price locked at confirmation. Zero unauthorized additions.
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-[#0B1F3A] font-heading tabular-nums">
                    {formatINR(booking.lockedBasePrice)}
                  </div>
                  <div className="text-[10px] text-[#64748B]">Base Locked Total</div>
                </div>
              </div>
            </div>

            {/* Current Stage Status & Progress Stepper */}
            <div className="p-4 rounded-xl border border-[#CBD5E1] bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                  Current Status
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    isPendingExtra
                      ? 'bg-amber-100 text-amber-800'
                      : isDelivered
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-teal-50 text-teal-800 border border-teal-200'
                  }`}
                >
                  {isPendingExtra ? 'Inspection Paused' : currentStageName}
                </span>
              </div>

              {/* Stepper Dots */}
              <div className="grid grid-cols-6 gap-1.5 pt-2">
                {TRACKER_STAGES.map((stName, idx) => {
                  const isCompleted = idx < currentStageIndex;
                  const isCurrent = idx === currentStageIndex;
                  return (
                    <div key={stName} className="flex flex-col gap-1">
                      <div
                        className={`h-2 rounded-full transition-all ${
                          isCompleted
                            ? 'bg-[#14B8A6]'
                            : isCurrent
                            ? isPendingExtra
                              ? 'bg-amber-500 animate-pulse'
                              : 'bg-[#0B1F3A] ring-2 ring-[#14B8A6]/40'
                            : 'bg-slate-200'
                        }`}
                      />
                      <span className="text-[9px] text-[#64748B] text-center truncate font-medium">
                        {stName.split(' ')[0]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Technician Extra Work Request (Inspection finding with Approve/Decline) */}
            {booking.extraWork && (
              <div className="p-4 rounded-2xl border border-amber-300 bg-amber-50/50 shadow-xs space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-amber-900 block">
                        Technician Inspection Finding
                      </span>
                      <h4 className="text-sm font-bold text-[#0B1F3A] mt-0.5">
                        {booking.extraWork.reason}
                      </h4>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-[#0B1F3A] font-heading tabular-nums block">
                      +{formatINR(booking.extraWork.price)}
                    </span>
                    <span className="text-[10px] text-[#64748B]">Parts & Labor</span>
                  </div>
                </div>

                <p className="text-xs text-[#334155] leading-relaxed bg-white p-3 rounded-xl border border-amber-200">
                  {booking.extraWork.description}
                </p>

                {/* Photo Placeholder */}
                <div className="p-3 rounded-xl border border-dashed border-amber-300 bg-white flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="text-left flex-1 min-w-0">
                    <div className="text-[11px] font-bold text-[#0B1F3A]">
                      {booking.extraWork.photoPlaceholder?.label || 'INSPECTION PHOTO'}
                    </div>
                    <div className="text-[11px] text-[#64748B] truncate mt-0.5">
                      {booking.extraWork.photoPlaceholder?.caption}
                    </div>
                  </div>
                </div>

                {/* Action Decision Buttons */}
                <div className="pt-2 border-t border-amber-200/60">
                  {booking.extraWork.status === 'pending' ? (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                      <span className="text-xs font-semibold text-amber-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-600 animate-ping"></span>
                        Timeline paused until decision is recorded
                      </span>

                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => declineExtraWork(booking.id)}
                          className="flex-1 sm:flex-initial px-4 py-2 rounded-xl border border-[#CBD5E1] bg-white hover:bg-slate-50 text-xs font-semibold text-[#475569] flex items-center justify-center gap-1.5 transition-colors"
                        >
                          <Ban className="w-3.5 h-3.5 text-[#DC2626]" />
                          <span>Decline (₹0)</span>
                        </button>

                        <button
                          onClick={() => approveExtraWork(booking.id)}
                          className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#14B8A6] hover:bg-[#0d9488] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Approve (+{formatINR(booking.extraWork.price)})</span>
                        </button>
                      </div>
                    </div>
                  ) : booking.extraWork.status === 'approved' ? (
                    <div className="p-2.5 rounded-xl bg-[#DCFCE7] text-[#15803D] text-xs font-medium flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-[#16A34A]" />
                        Approved by Customer · Added to invoice ({booking.extraWork.decidedAt})
                      </span>
                      <span className="font-bold tabular-nums">+{formatINR(booking.extraWork.price)}</span>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-[#FEE2E2] text-[#B91C1C] text-xs font-medium flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Ban className="w-4 h-4 text-[#DC2626]" />
                        Declined by Customer · Not serviced ({booking.extraWork.decidedAt})
                      </span>
                      <span className="font-bold">₹0</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Timestamped Job Log (Mandatory requirement #6) */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-[#14B8A6]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A]">
                  Timestamped Workshop Job Log
                </h3>
              </div>

              <div className="bg-[#F8F9FB] rounded-xl p-3 border border-[#E2E8F0] space-y-2.5 max-h-48 overflow-y-auto font-mono text-[11px]">
                {booking.jobLog?.map((entry, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <span className="text-slate-500 font-bold shrink-0">
                      [{entry.timestamp}]
                    </span>
                    <span className="text-slate-800 font-sans leading-tight">
                      {entry.event}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Handover & Location Summary */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 text-xs text-[#475569]">
              <div className="font-bold text-[#0B1F3A] uppercase tracking-wider text-[11px]">
                Handover Schedule
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-[#14B8A6]" />
                <span>
                  Slot: <strong>{booking.slotDate}</strong> ({booking.slotTime})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#14B8A6]" />
                <span className="truncate">
                  {booking.pickupType === 'doorstep' ? 'Pickup Address: ' : 'Workshop Drop: '}
                  <strong>{booking.address}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Footer: Final Recalculated Invoice (Pay After Service) */}
          <div className="p-6 border-t border-[#E2E8F0] bg-[#F8F9FB] space-y-2">
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-[#475569]">
                <span>Base Locked Total</span>
                <span className="font-mono">{formatINR(booking.lockedBasePrice)}</span>
              </div>
              {booking.extraWork?.status === 'approved' && (
                <div className="flex justify-between text-[#006B5F] font-medium">
                  <span>Approved Extra Work</span>
                  <span className="font-mono">+{formatINR(booking.extraWork.price)}</span>
                </div>
              )}
              <div className="pt-2 border-t border-[#CBD5E1] flex justify-between items-baseline">
                <div>
                  <span className="text-sm font-bold text-[#0B1F3A]">
                    Total Payable at Delivery
                  </span>
                  <span className="block text-[10px] text-[#64748B]">
                    Pay after service at workshop
                  </span>
                </div>
                <span className="text-xl font-bold text-[#0B1F3A] font-heading tabular-nums">
                  {formatINR(booking.finalPayable)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
