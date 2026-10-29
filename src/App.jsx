/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useApp } from './context/AppContext.jsx';

import Navbar from './components/Navbar.jsx';
import HomePage from './pages/HomePage.jsx';
import ServicesPage from './pages/ServicesPage.jsx';
import ContactPage from './pages/ContactPage.jsx';
import PreviewWrapper from './components/PreviewWrapper.jsx';

import AuthScreen from './components/auth/AuthScreen.jsx';
import MandatoryVehicleModal from './components/vehicle/MandatoryVehicleModal.jsx';

import VehicleDrawer from './components/drawers/VehicleDrawer.jsx';
import CartDrawer from './components/drawers/CartDrawer.jsx';
import CheckoutDrawer from './components/drawers/CheckoutDrawer.jsx';
import TrackerDrawer from './components/drawers/TrackerDrawer.jsx';

export default function App() {
  const { isLoggedIn, vehicles, authLoading } = useApp();

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#14B8A6] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-semibold text-[#0B1F3A]">Connecting to AutoTrust...</p>
        </div>
      </div>
    );
  }

  // 1. LOGIN FIRST: Until a user is logged in, show only the Login/Register screen
  if (!isLoggedIn) {
    return (
      <PreviewWrapper>
        <AuthScreen />
      </PreviewWrapper>
    );
  }

  // 2. VEHICLE REGISTRATION: If user has 0 vehicles, force mandatory vehicle registration
  if (vehicles.length === 0) {
    return (
      <PreviewWrapper>
        <MandatoryVehicleModal />
      </PreviewWrapper>
    );
  }

  // 3. MAIN WORKSHOP APPLICATION (Reachable only when logged in with >= 1 vehicle)
  return (
    <PreviewWrapper>
      <Navbar />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Slide-In Drawers and Overlays */}
      <VehicleDrawer />
      <CartDrawer />
      <CheckoutDrawer />
      <TrackerDrawer />
    </PreviewWrapper>
  );
}
