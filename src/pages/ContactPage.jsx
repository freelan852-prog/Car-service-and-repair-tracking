/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import {
  Phone,
  Mail,
  Clock,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Car,
  Bike,
} from 'lucide-react';

export default function ContactPage() {
  const { activeVehicle, currentUser } = useApp();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [callbackData, setCallbackData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    carModel: activeVehicle
      ? `${activeVehicle.brand} ${activeVehicle.model} (${activeVehicle.fuel})`
      : '',
    preferredTime: 'Morning (09:00 AM - 12:00 PM)',
    issueNotes: 'Periodic maintenance & safety check',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const faqs = [
    {
      q: 'Why do prices differ by vehicle type, category and fuel?',
      a: 'Different engine configurations and vehicle sizes require different oil grades, fluid capacities, and diagnostic routines. For example, Diesel cars require heavier soot-dispersing synthetic oils (+18%), while electric vehicles need high-voltage coolant tests but zero engine oil (-15%). Bikes use 4T specialized lubricants and chain services calibrated by engine cc.',
    },
    {
      q: 'How does the Locked Price Guarantee work?',
      a: 'The estimate locks permanently the moment you confirm your booking. No technician or workshop manager can adjust base labor or parts prices. Any additional repairs discovered during inspection pause the job and require your explicit in-app approval.',
    },
    {
      q: 'How does "Pay after service" work?',
      a: 'You pay zero advance fees during booking. Once your car or bike has been fully serviced and passes the final quality inspection, you inspect the vehicle and settle your final locked invoice via Cash, Card, or UPI at the workshop counter or with the delivery valet.',
    },
    {
      q: 'What happens if I decline an extra work request?',
      a: 'If our technician notices a worn component during inspection and issues an extra work request, you can click "Decline". The item is marked declined, zero charges are added to your invoice, and the timeline resumes immediately.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Page Header */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E6F4F1] text-xs font-semibold text-[#006B5F] mb-3">
          <Phone className="w-3.5 h-3.5 text-[#14B8A6]" />
          <span>Customer Support & Helpline</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#0B1F3A] font-heading tracking-tight">
          We’re Here to Help You Navigate Auto Service with Total Clarity
        </h1>
        <p className="text-sm sm:text-base text-[#475569] mt-2 leading-relaxed">
          Have questions about your vehicle specification, pricing calculations, or need assistance? Reach our dedicated support team.
        </p>
      </div>

      {/* Grid: Helpline Channels & Callback Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Helpline Channels (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#0B1F3A] font-heading">
              Direct Helpline Channels
            </h2>

            {/* Toll Free Call */}
            <div className="p-4 rounded-xl bg-[#F8F9FB] border border-[#CBD5E1] flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0B1F3A] text-white flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-[#14B8A6]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#64748B] block">
                  Toll-Free Customer Helpline
                </span>
                <span className="text-base font-bold text-[#0B1F3A] font-mono block mt-0.5">
                  1800-209-8787
                </span>
                <span className="text-[11px] text-[#475569] block mt-0.5">
                  Available Monday – Sunday: 8:00 AM – 8:00 PM
                </span>
              </div>
            </div>

            {/* WhatsApp Support */}
            <div className="p-4 rounded-xl bg-[#F8F9FB] border border-[#CBD5E1] flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#006B5F] text-white flex items-center justify-center shrink-0">
                <MessageSquare className="w-5 h-5 text-[#6DF5E1]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#64748B] block">
                  Instant WhatsApp Desk
                </span>
                <span className="text-base font-bold text-[#0B1F3A] font-mono block mt-0.5">
                  +91 98765 43210
                </span>
                <span className="text-[11px] text-[#475569] block mt-0.5">
                  Live response for estimates & slot rescheduling
                </span>
              </div>
            </div>

            {/* Email Support */}
            <div className="p-4 rounded-xl bg-[#F8F9FB] border border-[#CBD5E1] flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#0B1F3A] text-white flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-[#14B8A6]" />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-[#64748B] block">
                  Email Assistance
                </span>
                <span className="text-sm font-semibold text-[#0B1F3A] block mt-0.5">
                  support@autotrust-care.example
                </span>
                <span className="text-[11px] text-[#475569] block mt-0.5">
                  Written quotes & billing queries
                </span>
              </div>
            </div>
          </div>

          {/* Pay After Service Reminder Card */}
          <div className="bg-[#0B1F3A] text-white rounded-2xl p-6 space-y-3">
            <div className="flex items-center gap-2 text-[#14B8A6]">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Strict Zero-Advance Policy
              </span>
            </div>
            <h3 className="text-base font-bold font-heading">
              Pay After Service. 100% Satisfaction.
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We never ask for advance payments. Once all approved maintenance is finished, inspect your vehicle thoroughly and settle payment via Cash, UPI, or Card at handover.
            </p>
          </div>
        </div>

        {/* Right Column: Callback Request Form */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#0B1F3A] font-heading">
                Request a Service Advisor Callback
              </h2>
              <p className="text-xs text-[#64748B] mt-1">
                Enter your details to receive an immediate consultation regarding your vehicle maintenance.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-6 rounded-xl bg-[#F0FDF4] border border-[#BBF7D0] text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-[#15803D]">
                  Callback Request Submitted
                </h3>
                <p className="text-xs text-[#166534] max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{callbackData.name}</strong>. A service advisor will call your number ({callbackData.phone}) during your preferred window.
                </p>
                <button
                  onClick={() => setFormSubmitted(false)}
                  className="px-4 py-2 rounded-lg bg-[#0B1F3A] text-white text-xs font-semibold hover:bg-[#132B4F] transition-colors"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      value={callbackData.name}
                      onChange={(e) =>
                        setCallbackData({ ...callbackData, name: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#CBD5E1] focus:border-[#14B8A6] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      Contact Mobile Number
                    </label>
                    <input
                      type="tel"
                      value={callbackData.phone}
                      onChange={(e) =>
                        setCallbackData({ ...callbackData, phone: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-[#CBD5E1] focus:border-[#14B8A6] outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      Vehicle & Fuel Spec
                    </label>
                    <input
                      type="text"
                      value={callbackData.carModel}
                      onChange={(e) =>
                        setCallbackData({ ...callbackData, carModel: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#CBD5E1] focus:border-[#14B8A6] outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      Preferred Callback Window
                    </label>
                    <select
                      value={callbackData.preferredTime}
                      onChange={(e) =>
                        setCallbackData({ ...callbackData, preferredTime: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#CBD5E1] focus:border-[#14B8A6] outline-none bg-white"
                    >
                      <option>Morning (09:00 AM - 12:00 PM)</option>
                      <option>Afternoon (12:00 PM - 04:00 PM)</option>
                      <option>Evening (04:00 PM - 08:00 PM)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Describe Maintenance Need or Concern
                  </label>
                  <textarea
                    rows={3}
                    value={callbackData.issueNotes}
                    onChange={(e) =>
                      setCallbackData({ ...callbackData, issueNotes: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#CBD5E1] focus:border-[#14B8A6] outline-none"
                    placeholder="e.g. Periodic maintenance, brake bite check, chain tension, battery health..."
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3.5 px-4 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white text-xs font-bold transition-all shadow-md active:scale-[0.99]"
                  >
                    Request Callback
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Frequently Asked Questions */}
      <div className="pt-8 border-t border-[#E2E8F0] space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#0B1F3A] font-heading">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-[#64748B] mt-1">
            Learn more about our transparent pricing methodology and customer-first service policies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-[#E2E8F0] space-y-2"
            >
              <div className="flex items-start gap-2">
                <HelpCircle className="w-4 h-4 text-[#14B8A6] shrink-0 mt-0.5" />
                <h3 className="text-sm font-bold text-[#0B1F3A] font-heading leading-snug">
                  {faq.q}
                </h3>
              </div>
              <p className="text-xs text-[#475569] leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
