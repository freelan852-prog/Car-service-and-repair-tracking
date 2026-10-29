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
  getVehicleModelTierInfo,
} from '../../data/pricingData.js';
import {
  X,
  Check,
  Plus,
  Car,
  Bike,
  Fuel,
  Edit2,
  Trash2,
  AlertCircle,
  Hash,
  Sparkles,
} from 'lucide-react';

export default function VehicleDrawer() {
  const {
    drawers,
    closeDrawer,
    vehicles,
    activeVehicleId,
    setActiveVehicle,
    addVehicle,
    editVehicle,
    deleteVehicle,
  } = useApp();

  const [viewState, setViewState] = useState('list'); // 'list' | 'add' | 'edit'
  const [editingVehicleId, setEditingVehicleId] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    type: 'car',
    category: 'hatchback',
    modelTier: 'premium_hatch',
    brand: '',
    model: '',
    fuel: 'petrol',
    year: new Date().getFullYear(),
    regNumber: '',
  });
  const [formError, setFormError] = useState('');

  if (!drawers.car) return null;

  const handleStartAdd = () => {
    setFormData({
      type: 'car',
      category: 'hatchback',
      modelTier: 'premium_hatch',
      brand: '',
      model: '',
      fuel: 'petrol',
      year: new Date().getFullYear(),
      regNumber: '',
    });
    setFormError('');
    setViewState('add');
  };

  const handleStartEdit = (veh) => {
    setEditingVehicleId(veh.id);
    const tier = veh.modelTier || detectModelTier(veh.type, veh.brand, veh.model);
    setFormData({
      type: veh.type,
      category: veh.category,
      modelTier: tier,
      brand: veh.brand,
      model: veh.model,
      fuel: veh.fuel,
      year: veh.year,
      regNumber: veh.regNumber,
    });
    setFormError('');
    setViewState('edit');
  };

  const handleDelete = (vehId, e) => {
    e.stopPropagation();
    if (window.confirm('Delete this vehicle? If this is your last vehicle, you will need to add a new vehicle.')) {
      deleteVehicle(vehId);
    }
  };

  const handleTypeToggle = (type) => {
    setFormData((prev) => ({
      ...prev,
      type,
      category: type === 'car' ? 'hatchback' : 'commuter',
      modelTier: type === 'car' ? 'premium_hatch' : 'standard_scooter',
      fuel: 'petrol',
    }));
  };

  const handleBrandChange = (newBrand) => {
    const updated = { ...formData, brand: newBrand };
    if (formData.model.length >= 2) {
      updated.modelTier = detectModelTier(formData.type, newBrand, formData.model);
    }
    setFormData(updated);
  };

  const handleModelChange = (newModel) => {
    const updated = { ...formData, model: newModel };
    if (newModel.length >= 2) {
      updated.modelTier = detectModelTier(formData.type, formData.brand, newModel);
    }
    setFormData(updated);
  };

  const handleSaveForm = (e) => {
    e.preventDefault();
    if (!formData.brand.trim() || !formData.model.trim() || !formData.regNumber.trim()) {
      setFormError('Please fill in Brand, Model and Registration Number.');
      return;
    }

    let segment = 'hatchback';
    if (formData.type === 'bike') {
      segment =
        formData.modelTier === 'entry_commuter' || formData.modelTier === 'standard_scooter'
          ? 'commuter'
          : 'sports';
    } else {
      segment = formData.modelTier?.includes('suv')
        ? 'suv'
        : formData.modelTier?.includes('sedan')
        ? 'sedan'
        : 'hatchback';
    }

    const payload = {
      ...formData,
      segment,
      category: segment,
    };

    if (viewState === 'add') {
      addVehicle(payload);
    } else if (viewState === 'edit' && editingVehicleId) {
      editVehicle(editingVehicleId, payload);
    }
    setViewState('list');
    setEditingVehicleId(null);
    setFormError('');
  };

  const availableTiers =
    formData.type === 'car' ? MODEL_TIERS.car : MODEL_TIERS.bike;

  const availableFuels =
    formData.type === 'car'
      ? ['petrol', 'diesel', 'cng', 'electric']
      : ['petrol', 'electric'];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => closeDrawer('car')}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#E2E8F0] flex items-center justify-between bg-[#F8F9FB]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0B1F3A] flex items-center justify-center text-white">
                <Car className="w-4 h-4 text-[#14B8A6]" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0B1F3A] font-heading">
                  {viewState === 'list'
                    ? 'Manage Vehicles'
                    : viewState === 'add'
                    ? 'Add New Vehicle'
                    : 'Edit Vehicle Profile'}
                </h2>
                <p className="text-xs text-[#64748B]">
                  {viewState === 'list'
                    ? `${vehicles.length} vehicle(s) in your garage`
                    : 'Prices adjust to model tier & fuel spec'}
                </p>
              </div>
            </div>
            <button
              onClick={() => closeDrawer('car')}
              className="p-1.5 rounded-lg text-[#64748B] hover:text-[#0B1F3A] hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Drawer Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {viewState === 'list' ? (
              <>
                {/* Vehicles List */}
                <div className="space-y-3">
                  {vehicles.map((veh) => {
                    const isSelected = veh.id === activeVehicleId;
                    const tierInfo = getVehicleModelTierInfo(veh);
                    const fuelLabel = PRICING_CONFIG.fuels[veh.fuel]?.label || veh.fuel;

                    return (
                      <div
                        key={veh.id}
                        onClick={() => {
                          setActiveVehicle(veh.id);
                          closeDrawer('car');
                        }}
                        className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                          isSelected
                            ? 'border-[#14B8A6] bg-[#F7FDFC] shadow-sm ring-1 ring-[#14B8A6]/40'
                            : 'border-[#E2E8F0] hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-[#0B1F3A]">
                              {veh.type === 'bike' ? (
                                <Bike className="w-4 h-4 text-[#14B8A6]" />
                              ) : (
                                <Car className="w-4 h-4 text-[#14B8A6]" />
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-bold text-[#0B1F3A] font-heading">
                                {veh.brand} {veh.model}
                              </div>
                              <div className="text-xs font-mono font-bold uppercase tracking-wider text-[#475569] mt-0.5">
                                {veh.regNumber}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStartEdit(veh);
                              }}
                              className="p-1 text-[#64748B] hover:text-[#0B1F3A] hover:bg-slate-100 rounded"
                              title="Edit Vehicle"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={(e) => handleDelete(veh.id, e)}
                              className="p-1 text-[#94A3B8] hover:text-[#DC2626] hover:bg-red-50 rounded"
                              title="Delete Vehicle"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Model Tier & Multiplier Readout */}
                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-[#64748B]">
                          <div>
                            <span className="font-semibold text-[#0B1F3A]">
                              {tierInfo.label}
                            </span>{' '}
                            <span className="text-[#006B5F] font-bold">
                              ({tierInfo.multiplier}x)
                            </span>
                          </div>
                          <span className="capitalize font-semibold text-[#0B1F3A] flex items-center gap-1">
                            <Fuel className="w-3 h-3 text-[#14B8A6]" />
                            {fuelLabel}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Another Vehicle CTA */}
                <button
                  type="button"
                  onClick={handleStartAdd}
                  className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-[#CBD5E1] hover:border-[#14B8A6] hover:bg-slate-50 text-sm font-semibold text-[#0B1F3A] flex items-center justify-center gap-2 transition-all"
                >
                  <Plus className="w-4 h-4 text-[#14B8A6]" />
                  <span>Add Another Vehicle (Car or Bike)</span>
                </button>
              </>
            ) : (
              /* ADD OR EDIT FORM */
              <form onSubmit={handleSaveForm} className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                    {viewState === 'add' ? 'New Vehicle Specifications' : 'Update Specifications'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setViewState('list');
                      setFormError('');
                    }}
                    className="text-xs text-[#64748B] hover:text-[#0B1F3A]"
                  >
                    Cancel
                  </button>
                </div>

                {formError && (
                  <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Type Toggle */}
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Vehicle Type
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleTypeToggle('car')}
                      className={`p-2.5 rounded-lg border text-center text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        formData.type === 'car'
                          ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white'
                          : 'border-[#CBD5E1] text-[#334155]'
                      }`}
                    >
                      <Car className="w-4 h-4 text-[#14B8A6]" />
                      <span>Car</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleTypeToggle('bike')}
                      className={`p-2.5 rounded-lg border text-center text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        formData.type === 'bike'
                          ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white'
                          : 'border-[#CBD5E1] text-[#334155]'
                      }`}
                    >
                      <Bike className="w-4 h-4 text-[#14B8A6]" />
                      <span>Bike / Scooter</span>
                    </button>
                  </div>
                </div>

                {/* Brand & Model */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      Brand / Make
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Maruti, Toyota, RE"
                      value={formData.brand}
                      onChange={(e) => handleBrandChange(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] focus:border-[#14B8A6] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      Model
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Swift, Fortuner, Classic"
                      value={formData.model}
                      onChange={(e) => handleModelChange(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] focus:border-[#14B8A6] outline-none"
                    />
                  </div>
                </div>

                {/* Model Tier / Pricing Multiplier */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-[#334155]">
                      Model Segment (Pricing Calibration)
                    </label>
                    <span className="text-[10px] text-[#006B5F] flex items-center gap-0.5 font-medium">
                      <Sparkles className="w-2.5 h-2.5" />
                      Auto-detected
                    </span>
                  </div>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {Object.entries(availableTiers).map(([k, t]) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setFormData({ ...formData, modelTier: k })}
                        className={`w-full p-2 rounded-lg border text-left text-xs transition-all flex items-center justify-between ${
                          formData.modelTier === k
                            ? 'border-[#14B8A6] bg-[#F0FDFA] font-bold text-[#0B1F3A] ring-1 ring-[#14B8A6]'
                            : 'border-[#CBD5E1] text-[#475569] hover:bg-slate-50'
                        }`}
                      >
                        <span className="truncate">{t.label}</span>
                        <span className="text-[11px] font-bold text-[#006B5F] shrink-0 ml-2">
                          {t.multiplier}x rate
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Fuel Type */}
                <div>
                  <label className="block text-xs font-semibold text-[#334155] mb-1">
                    Fuel Type
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
                    {availableFuels.map((fKey) => (
                      <button
                        key={fKey}
                        type="button"
                        onClick={() => setFormData({ ...formData, fuel: fKey })}
                        className={`p-2 rounded-lg border text-center text-xs capitalize transition-all ${
                          formData.fuel === fKey
                            ? 'border-[#0B1F3A] bg-[#0B1F3A] text-white font-bold'
                            : 'border-[#CBD5E1] text-[#475569]'
                        }`}
                      >
                        {PRICING_CONFIG.fuels[fKey]?.label || fKey}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Registration Number & Year */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      Registration Plate
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="MH 02 DX 4821"
                      value={formData.regNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, regNumber: e.target.value.toUpperCase() })
                      }
                      className="w-full px-3 py-2 text-xs font-mono font-bold uppercase rounded-lg border border-[#CBD5E1] focus:border-[#14B8A6] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#334155] mb-1">
                      Year
                    </label>
                    <input
                      type="number"
                      min="2000"
                      max="2027"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-[#CBD5E1] focus:border-[#14B8A6] outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0B1F3A] hover:bg-[#132B4F] text-white text-xs font-bold transition-all shadow-sm"
                  >
                    {viewState === 'add' ? 'Save & Add Vehicle' : 'Update Vehicle Profile'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
