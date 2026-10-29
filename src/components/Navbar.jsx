/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import {
  Car,
  Bike,
  ShoppingBag,
  Activity,
  Menu,
  X,
  ShieldCheck,
  ChevronDown,
  LogOut,
  User,
} from 'lucide-react';

export default function Navbar() {
  const {
    activeVehicle,
    cartCount,
    openDrawer,
    bookings,
    currentUser,
    logoutUser,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Find the most recently active non-completed booking if any
  const ongoingBooking = bookings.find((b) => !b.isCompleted) || bookings[0];

  const navLinkClasses = ({ isActive }) =>
    `text-xs sm:text-sm font-medium transition-colors whitespace-nowrap shrink-0 relative py-1 ${
      isActive
        ? 'text-[#0B1F3A] font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#14B8A6] after:rounded-full'
        : 'text-[#44474D] hover:text-[#0B1F3A]'
    }`;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0]">
      {/* Top Banner with Workshop and User Indicator */}
      <div className="bg-[#0B1F3A] text-white text-[11px] py-1.5 px-4 tracking-wide font-medium flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#14B8A6]"></span>
          <span className="text-slate-300">AUTOTRUST WORKSHOP</span>
          <span className="hidden sm:inline text-slate-500">·</span>
          <span className="hidden sm:inline text-slate-300">
            {currentUser ? `Logged in as ${currentUser.name}` : 'Portal Session'}
          </span>
        </div>
        {currentUser && (
          <button
            onClick={logoutUser}
            className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white transition-colors"
            title="Log out of your account"
          >
            <LogOut className="w-3 h-3" />
            <span>Logout</span>
          </button>
        )}
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3 sm:gap-6">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <NavLink to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-[#0B1F3A] flex items-center justify-center text-white shadow-sm group-hover:bg-[#132B4F] transition-colors">
                <ShieldCheck className="w-5 h-5 text-[#14B8A6]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight text-[#0B1F3A] font-heading leading-tight">
                  AutoTrust
                </span>
                <span className="text-[10px] text-[#64748B] font-medium tracking-wider uppercase -mt-0.5">
                  Car & Bike Care
                </span>
              </div>
            </NavLink>
          </div>

          {/* Zone 2: Navigation Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-8">
            <NavLink to="/" className={navLinkClasses}>
              Home
            </NavLink>
            <NavLink to="/services" className={navLinkClasses}>
              Services & Pricing
            </NavLink>
            <NavLink to="/contact" className={navLinkClasses}>
              Contact & Helpline
            </NavLink>
          </nav>

          {/* Zone 3: Actions (Vehicle Switcher, Cart, Track Booking) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Active Vehicle Switcher Button */}
            {activeVehicle && (
              <button
                onClick={() => openDrawer('car')}
                className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-[#CBD5E1] hover:border-[#14B8A6] bg-[#F8F9FB] hover:bg-white text-xs font-medium text-[#0B1F3A] transition-all group max-w-[140px] sm:max-w-[200px]"
                title="Switch, Edit or Add Vehicle"
              >
                {activeVehicle.type === 'bike' ? (
                  <Bike className="w-3.5 h-3.5 text-[#14B8A6] shrink-0" />
                ) : (
                  <Car className="w-3.5 h-3.5 text-[#14B8A6] shrink-0" />
                )}
                <div className="flex flex-col text-left truncate">
                  <span className="font-semibold truncate leading-tight">
                    {activeVehicle.brand} {activeVehicle.model}
                  </span>
                  <span className="text-[10px] text-[#64748B] uppercase font-mono leading-none truncate">
                    {activeVehicle.regNumber}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-[#64748B] shrink-0 group-hover:text-[#0B1F3A] transition-colors" />
              </button>
            )}

            {/* Cart Button */}
            <button
              onClick={() => openDrawer('cart')}
              className="relative p-2 rounded-lg border border-[#CBD5E1] hover:border-[#14B8A6] bg-white text-[#0B1F3A] hover:bg-slate-50 transition-colors flex items-center justify-center"
              title="View Estimate Cart"
              aria-label="View Estimate Cart"
            >
              <ShoppingBag className="w-4 h-4 text-[#0B1F3A]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#14B8A6] text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Quick Ongoing Tracker Trigger if user has a booking */}
            {ongoingBooking && (
              <button
                onClick={() => openDrawer('tracker', ongoingBooking.id)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#DCFCE7] text-[#15803D] hover:bg-[#bbf7d0] border border-[#86efac] text-xs font-semibold transition-all shadow-xs"
                title="View Live Bay Tracking"
              >
                <Activity className="w-3.5 h-3.5 text-[#16A34A] animate-pulse" />
                <span className="hidden sm:inline">{ongoingBooking.stageName}</span>
                <span className="font-mono text-[10px]">#{ongoingBooking.id}</span>
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-[#44474D] hover:text-[#0B1F3A]"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#E2E8F0] py-3 px-2 flex flex-col gap-2">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-[#0B1F3A] text-white' : 'text-[#334155] hover:bg-slate-100'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-[#0B1F3A] text-white' : 'text-[#334155] hover:bg-slate-100'
                }`
              }
            >
              Services & Pricing
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-sm font-medium ${
                  isActive ? 'bg-[#0B1F3A] text-white' : 'text-[#334155] hover:bg-slate-100'
                }`
              }
            >
              Contact & Helpline
            </NavLink>
          </div>
        )}
      </div>
    </header>
  );
}
