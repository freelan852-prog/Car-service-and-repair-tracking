/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  PRICING_CONFIG,
  MODEL_TIERS,
  detectModelTier,
} from '../../data/pricingData.js';
import {
  Car,
  Bike,
  Plus,
  ShieldCheck,
  Check,
  AlertCircle,
  Fuel,
  Calendar,
  Hash,
  Sparkles,
} from 'lucide-react';

export default function MandatoryVehicleModal() {
  const { addVehicle, currentUser } = useApp();

  const [vehicleType, setVehicleType] = useState('car'); // 'car' | 'bike'
  const [modelTier, setModelTier] = useState('premium_hatch');
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [fuel, setFuel] = useState('petrol');
  const [year, setYear] = useState(new Date().getFullYear());
  const [regNumber, setRegNumber] = useState('');
  const [error, setError] = useState('');

  // Handle vehicle type change and reset defaults
  const handleTypeChange = (type) => {
    setVehicleType(type);
    if (type === 'car') {
      setModelTier('premium_hatch');
      setFuel('petrol');
    } else {
      setModelTier('standard_scooter');
      setFuel('petrol');
    }
  };

  // Smart detect model tier when user types brand or model
  const handleModelChange = (newModel, currentBrand = brand) => {
    setModel(newModel);
    if (newModel.length >= 2) {
      const detected = detectModelTier(vehicleType, currentBrand, newModel);
      setModelTier(detected);
    }
  };

  const handleBrandChange = (newBrand) => {
    setBrand(newBrand);
    if (model.length >= 2) {
      const detected = detectModelTier(vehicleType, newBrand, model);
      setModelTier(detected);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!brand.trim() || !model.trim() || !regNumber.trim()) {
      setError('Please fill in Brand, Model, and Registration Number.');
      return;
    }

    let segment = 'hatchback';
    if (vehicleType === 'bike') {
      segment = modelTier === 'entry_commuter' || modelTier === 'standard_scooter' ? 'commuter' : 'sports';
    } else {
      segment = modelTier.includes('suv') ? 'suv' : modelTier.includes('sedan') ? 'sedan' : 'hatchback';
    }

    addVehicle({
      type: vehicleType,
      segment,
      category: segment,
      modelTier,
      brand,
      model,
      fuel,
      year,
      regNumber,
    });
  };

  const availableTiers =
    vehicleType === 'car' ? MODEL_TIERS.car : MODEL_TIERS.bike;

  const availableFuels =
    vehicleType === 'car'
      ? ['petrol', 'diesel', 'cng', 'electric']
      : ['petrol', 'electric'];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Header */}
        <div className="bg-[#0B1F3A] text-white p-6 sm:p-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[#6DF5E1] text-[11px] font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Step 2 of 2 · Mandatory Vehicle Profile</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-heading">
            Welcome, {currentUser?.name}! Add Your Vehicle
          </h2>
          <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
            AutoTrust calibrates service costs specifically to your vehicle's make, model tier, and fuel system.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* 1. Vehicle Type Toggle (Car vs Bike) */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0B1F3A] mb-2">
              1. Select Vehicle Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleTypeChange('car')}
                className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  vehicleType === 'car'
                    ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white shadow-sm'
                    : 'border-[#CBD5E1] hover:bg-slate-50 text-[#334155]'
                }`}
              >
                <Car className="w-5 h-5 text-[#14B8A6]" />
                <div>
                  <div className="text-sm font-bold">Car / Four-Wheeler</div>
                  <div className={`text-[10px] ${vehicleType === 'car' ? 'text-slate-300' : 'text-[#64748B]'}`}>
                    Hatchback, Sedan, SUV
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('bike')}
                className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                  vehicleType === 'bike'
                    ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white shadow-sm'
                    : 'border-[#CBD5E1] hover:bg-slate-50 text-[#334155]'
                }`}
              >
                <Bike className="w-5 h-5 text-[#14B8A6]" />
                <div>
                  <div className="text-sm font-bold">Bike / Motorcycle</div>
                  <div className={`text-[10px] ${vehicleType === 'bike' ? 'text-slate-300' : 'text-[#64748B]'}`}>
                    Scooter, Street, Cruiser
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* 2. Brand & Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">
                Brand / Make
              </label>
              <input
                type="text"
                required
                placeholder={vehicleType === 'car' ? 'e.g. Maruti, Hyundai, Toyota' : 'e.g. Royal Enfield, Honda, Yamaha'}
                value={brand}
                onChange={(e) => handleBrandChange(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] focus:border-[#14B8A6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1">
                Model Name
              </label>
              <input
                type="text"
                required
                placeholder={vehicleType === 'car' ? 'e.g. Swift, Fortuner, City, Creta' : 'e.g. Classic 350, Activa, R15'}
                value={model}
                onChange={(e) => handleModelChange(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] focus:border-[#14B8A6] outline-none"
              />
            </div>
          </div>

          {/* 3. Model Segment / Pricing Tier */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0B1F3A]">
                2. Model Segment (Pricing Multiplier)
              </label>
              <span className="text-[10px] text-[#006B5F] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#14B8A6]" />
                Auto-calibrated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
              {Object.entries(availableTiers).map(([k, t]) => {
                const isSelected = modelTier === k;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setModelTier(k)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      isSelected
                        ? 'border-[#14B8A6] bg-[#F0FDFA] text-[#0B1F3A] font-bold ring-1 ring-[#14B8A6]'
                        : 'border-[#CBD5E1] hover:bg-slate-50 text-[#475569]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="truncate font-semibold">{t.label}</span>
                      <span className="text-[10px] text-[#006B5F] shrink-0 font-bold">
                        {t.multiplier}x rate
                      </span>
                    </div>
                    <div className="text-[10px] text-[#64748B] font-normal truncate mt-0.5">
                      {t.description}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Fuel Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#0B1F3A] mb-1.5 flex items-center gap-1">
              <Fuel className="w-3 h-3 text-[#14B8A6]" />
              3. Fuel Specification
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {availableFuels.map((fKey) => {
                const fInfo = PRICING_CONFIG.fuels[fKey];
                return (
                  <button
                    key={fKey}
                    type="button"
                    onClick={() => setFuel(fKey)}
                    className={`p-2 rounded-xl border text-center text-xs capitalize transition-all ${
                      fuel === fKey
                        ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white font-bold'
                        : 'border-[#CBD5E1] text-[#475569] hover:bg-slate-50'
                    }`}
                  >
                    <div>{fInfo.label}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Year & Registration Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-[#14B8A6]" />
                Manufacturing Year
              </label>
              <input
                type="number"
                min="2000"
                max="2027"
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#CBD5E1] focus:border-[#14B8A6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#334155] mb-1 flex items-center gap-1">
                <Hash className="w-3 h-3 text-[#14B8A6]" />
                Registration Plate
              </label>
              <input
                type="text"
                required
                placeholder="MH 02 DX 4821"
                value={regNumber}
                onChange={(e) => setRegNumber(e.target.value.toUpperCase())}
                className="w-full px-3 py-2 text-xs font-mono font-bold tracking-wider uppercase rounded-xl border border-[#CBD5E1] focus:border-[#14B8A6] outline-none"
              />
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-[#14B8A6] hover:bg-[#0d9488] text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
            >
              <Check className="w-4 h-4" />
              <span>Save Vehicle & Calculate Transparent Prices</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
