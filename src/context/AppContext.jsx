/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from 'react';
import {
  authAPI,
  vehicleAPI,
  serviceAPI,
  orderAPI,
  TOKEN_KEY,
} from '../services/api.js';
import {
  TRACKER_STAGES,
  formatINR,
  detectModelTier,
  MODEL_TIERS,
} from '../data/pricingData.js';

const AppContext = createContext(null);

function formatTimestamp(time) {
  if (!time) return '';
  const d = new Date(time);
  return d.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function normalizeVehicle(v) {
  if (!v) return null;
  const id = v.id || v._id;
  const regNumber = v.regNumber || v.regNo || '';
  const tier =
    v.modelTier ||
    detectModelTier(v.type, v.brand, v.model);

  return {
    ...v,
    id,
    _id: id,
    regNumber,
    regNo: regNumber,
    modelTier: tier,
    segment: v.segment || (v.type === 'bike' ? 'commuter' : 'hatchback'),
  };
}

function normalizeOrder(order) {
  if (!order) return null;
  const id = order.id || order._id;
  const status = order.status || 'Booked';
  const stageIndex = Math.max(0, TRACKER_STAGES.indexOf(status));
  const stageName = TRACKER_STAGES[stageIndex] || status;

  const vehicle = normalizeVehicle(order.vehicle);

  // Extras
  const firstExtra = order.extras && order.extras.length > 0 ? order.extras[0] : null;
  const extraWork = firstExtra
    ? {
        id: firstExtra.extraId || firstExtra._id || firstExtra.id,
        extraId: firstExtra.extraId || firstExtra._id || firstExtra.id,
        reason: firstExtra.reason,
        component: firstExtra.component,
        description: firstExtra.description,
        price: firstExtra.price,
        status: firstExtra.status,
        photoPlaceholder: firstExtra.photoPlaceholder,
        createdAt: formatTimestamp(firstExtra.createdAt),
        decidedAt: firstExtra.decidedAt ? formatTimestamp(firstExtra.decidedAt) : null,
      }
    : null;

  // Job log mapping
  const jobLog = (order.log || []).map((l) => ({
    timestamp: formatTimestamp(l.timestamp),
    event: l.message,
    type: l.type,
  }));

  return {
    ...order,
    id,
    _id: id,
    status,
    stageIndex,
    stageName,
    vehicle,
    lockedBasePrice: order.lockedTotal,
    lockedTotal: order.lockedTotal,
    finalPayable: order.finalTotal,
    finalTotal: order.finalTotal,
    pickupType: order.pickupOption === 'self' ? 'self' : 'doorstep',
    slotDate: order.slot?.includes('·') ? order.slot.split('·')[0].trim() : 'Tomorrow',
    slotTime: order.slot?.includes('·') ? order.slot.split('·')[1].trim() : order.slot || '09:30 AM - 10:30 AM',
    extraWork,
    jobLog,
  };
}

export function AppProvider({ children }) {
  // --------------------------------------------------------------------------
  // 1. AUTH STATE (Stored only as JWT in localStorage)
  // --------------------------------------------------------------------------
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [currentUser, setCurrentUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  // --------------------------------------------------------------------------
  // 2. VEHICLES STATE (Fetched via API)
  // --------------------------------------------------------------------------
  const [vehicles, setVehicles] = useState([]);
  const [activeVehicleId, setActiveVehicleId] = useState(null);
  const [vehiclesLoading, setVehiclesLoading] = useState(false);

  // --------------------------------------------------------------------------
  // 3. CATALOG & CART (Prices calculated and sourced only from Server API)
  // --------------------------------------------------------------------------
  const [catalogServices, setCatalogServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [cart, setCart] = useState([]); // Array of { serviceId, name, calculatedPrice, qty, etc. }

  // --------------------------------------------------------------------------
  // 4. DRAWERS
  // --------------------------------------------------------------------------
  const [drawers, setDrawers] = useState({
    car: false,
    cart: false,
    checkout: false,
    tracker: false,
  });
  const [activeTrackerBookingId, setActiveTrackerBookingId] = useState(null);

  // --------------------------------------------------------------------------
  // 5. ORDERS & BOOKINGS (Fetched via API)
  // --------------------------------------------------------------------------
  const [bookings, setBookings] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Preview Mode Toggle
  const [previewMode, setPreviewMode] = useState('desktop');

  // Handle unauthorized event
  useEffect(() => {
    const handleUnauthorized = () => {
      setToken(null);
      setCurrentUser(null);
      setVehicles([]);
      setBookings([]);
      setCart([]);
      setActiveVehicleId(null);
    };

    window.addEventListener('autotrust:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('autotrust:unauthorized', handleUnauthorized);
  }, []);

  // Fetch initial profile if token exists
  useEffect(() => {
    let isMounted = true;

    async function checkAuth() {
      const storedToken = localStorage.getItem(TOKEN_KEY);
      if (!storedToken) {
        setAuthLoading(false);
        return;
      }

      try {
        const res = await authAPI.getMe();
        if (isMounted && res.success) {
          setCurrentUser(res.user);
        }
      } catch (err) {
        console.warn('Initial session check failed:', err.message);
        localStorage.removeItem(TOKEN_KEY);
        if (isMounted) {
          setToken(null);
          setCurrentUser(null);
        }
      } finally {
        if (isMounted) setAuthLoading(false);
      }
    }

    checkAuth();
    return () => {
      isMounted = false;
    };
  }, [token]);

  // Load Vehicles and Orders whenever currentUser is authenticated
  const fetchVehicles = useCallback(async () => {
    try {
      setVehiclesLoading(true);
      const res = await vehicleAPI.getVehicles();
      if (res.success) {
        const norm = res.vehicles.map(normalizeVehicle);
        setVehicles(norm);
        if (norm.length > 0) {
          setActiveVehicleId((prev) => (prev && norm.some((v) => v.id === prev) ? prev : norm[0].id));
        } else {
          setActiveVehicleId(null);
        }
      }
    } catch (err) {
      console.error('Failed fetching vehicles:', err);
    } finally {
      setVehiclesLoading(false);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const res = await orderAPI.getOrders();
      if (res.success) {
        const norm = res.orders.map(normalizeOrder);
        setBookings(norm);
      }
    } catch (err) {
      console.error('Failed fetching orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  useEffect(() => {
    if (currentUser) {
      fetchVehicles();
      fetchOrders();
    }
  }, [currentUser, fetchVehicles, fetchOrders]);

  // Active Vehicle Computed
  const activeVehicle = useMemo(() => {
    if (!vehicles.length) return null;
    return vehicles.find((v) => v.id === activeVehicleId) || vehicles[0];
  }, [vehicles, activeVehicleId]);

  // Fetch Services from server whenever active vehicle changes
  useEffect(() => {
    let isMounted = true;

    async function loadServices() {
      if (!activeVehicle) {
        setCatalogServices([]);
        return;
      }

      try {
        setServicesLoading(true);
        const res = await serviceAPI.getServices(activeVehicle.id);
        if (isMounted && res.success) {
          setCatalogServices(res.services);

          // Update any items in cart with the server's price for this vehicle
          setCart((prevCart) => {
            return prevCart
              .map((cartItem) => {
                const srv = res.services.find((s) => s.id === cartItem.serviceId);
                if (!srv) return null;
                return {
                  ...cartItem,
                  name: srv.name,
                  category: srv.categoryName,
                  calculatedPrice: srv.calculatedPrice,
                  vehicleId: activeVehicle.id,
                };
              })
              .filter(Boolean);
          });
        }
      } catch (err) {
        console.error('Failed fetching services for vehicle:', err);
      } finally {
        if (isMounted) setServicesLoading(false);
      }
    }

    if (currentUser && activeVehicle) {
      loadServices();
    }
    return () => {
      isMounted = false;
    };
  }, [activeVehicle?.id, currentUser]);

  // --------------------------------------------------------------------------
  // AUTH ACTIONS
  // --------------------------------------------------------------------------
  const registerUser = async ({ name, phone, email, password }) => {
    setAuthError('');
    try {
      const res = await authAPI.register({ name, phone, email, password });
      if (res.success && res.token) {
        localStorage.setItem(TOKEN_KEY, res.token);
        setToken(res.token);
        setCurrentUser(res.user);
        return true;
      }
      return false;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.code === 'ECONNABORTED'
          ? 'Server request timed out. Please try again.'
          : err.message?.includes('Network')
          ? 'Unable to connect to AutoTrust server. Please try again.'
          : 'Registration failed. Please try again.');
      setAuthError(msg);
      return false;
    }
  };

  const loginUser = async (email, password) => {
    setAuthError('');
    try {
      const res = await authAPI.login({ email, password });
      if (res.success && res.token) {
        localStorage.setItem(TOKEN_KEY, res.token);
        setToken(res.token);
        setCurrentUser(res.user);
        return true;
      }
      return false;
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        (err.code === 'ECONNABORTED'
          ? 'Server request timed out. Please try again.'
          : err.message?.includes('Network')
          ? 'Unable to connect to AutoTrust server. Please try again.'
          : 'Invalid email or password.');
      setAuthError(msg);
      return false;
    }
  };

  const logoutUser = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setCurrentUser(null);
    setVehicles([]);
    setBookings([]);
    setCart([]);
    setActiveVehicleId(null);
    setAuthError('');
    closeAllDrawers();
  };

  // --------------------------------------------------------------------------
  // VEHICLE ACTIONS (API CRUD)
  // --------------------------------------------------------------------------
  const resolveSegment = (type, modelTier, segment, category) => {
    const raw = segment || category;
    if (raw && ['hatchback', 'sedan', 'suv', 'commuter', 'sports'].includes(raw.toLowerCase())) {
      return raw.toLowerCase();
    }
    if (type === 'bike') {
      return modelTier === 'sports' || modelTier === 'superbike' || modelTier === 'cruiser_tourer'
        ? 'sports'
        : 'commuter';
    }
    if (modelTier) {
      if (modelTier.includes('suv')) return 'suv';
      if (modelTier.includes('sedan')) return 'sedan';
    }
    return 'hatchback';
  };

  const addVehicle = async (vehicleData) => {
    try {
      const type = vehicleData.type || 'car';
      const segment = resolveSegment(
        type,
        vehicleData.modelTier,
        vehicleData.segment,
        vehicleData.category
      );

      const payload = {
        type,
        brand: (vehicleData.brand || '').trim(),
        model: (vehicleData.model || '').trim(),
        segment,
        fuel: vehicleData.fuel || 'petrol',
        year: parseInt(vehicleData.year, 10) || new Date().getFullYear(),
        regNo: (vehicleData.regNumber || vehicleData.regNo || '').trim().toUpperCase(),
      };

      const res = await vehicleAPI.createVehicle(payload);
      if (res.success) {
        const norm = normalizeVehicle(res.vehicle);
        setVehicles((prev) => [...prev, norm]);
        setActiveVehicleId(norm.id);
        return norm;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to add vehicle.';
      alert(msg);
      throw err;
    }
  };

  const editVehicle = async (vehicleId, updatedFields) => {
    try {
      const type = updatedFields.type || 'car';
      const segment = resolveSegment(
        type,
        updatedFields.modelTier,
        updatedFields.segment,
        updatedFields.category
      );

      const payload = {
        type,
        brand: (updatedFields.brand || '').trim(),
        model: (updatedFields.model || '').trim(),
        segment,
        fuel: updatedFields.fuel || 'petrol',
        year: parseInt(updatedFields.year, 10) || new Date().getFullYear(),
        regNo: (updatedFields.regNumber || updatedFields.regNo || '').trim().toUpperCase(),
      };

      const res = await vehicleAPI.updateVehicle(vehicleId, payload);
      if (res.success) {
        const norm = normalizeVehicle(res.vehicle);
        setVehicles((prev) => prev.map((v) => (v.id === vehicleId ? norm : v)));
        return norm;
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update vehicle.';
      alert(msg);
      throw err;
    }
  };

  const deleteVehicle = async (vehicleId) => {
    try {
      const res = await vehicleAPI.deleteVehicle(vehicleId);
      if (res.success) {
        setVehicles((prev) => {
          const rem = prev.filter((v) => v.id !== vehicleId);
          if (activeVehicleId === vehicleId) {
            setActiveVehicleId(rem.length > 0 ? rem[0].id : null);
          }
          return rem;
        });
        setCart((prev) => prev.filter((i) => i.vehicleId !== vehicleId));
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete vehicle.';
      alert(msg);
      throw err;
    }
  };

  const setActiveVehicle = (vehicleId) => {
    setActiveVehicleId(vehicleId);
  };

  // --------------------------------------------------------------------------
  // CART ACTIONS
  // --------------------------------------------------------------------------
  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.calculatedPrice || 0) * item.qty, 0);
  }, [cart]);

  const cartGst = useMemo(() => {
    return Math.round(cartSubtotal * 0.18);
  }, [cartSubtotal]);

  const cartTotal = useMemo(() => {
    return cartSubtotal + cartGst;
  }, [cartSubtotal, cartGst]);

  const addToCart = (service) => {
    if (!activeVehicle) return;

    setCart((prev) => {
      const existing = prev.find((i) => i.serviceId === service.id);
      if (existing) {
        return prev.map((i) =>
          i.serviceId === service.id ? { ...i, qty: i.qty + 1 } : i
        );
      }
      return [
        ...prev,
        {
          serviceId: service.id,
          name: service.name,
          category: service.categoryName,
          basePrice: service.basePrice,
          calculatedPrice: service.calculatedPrice,
          durationHours: service.durationHours,
          qty: 1,
          vehicleId: activeVehicle.id,
        },
      ];
    });
  };

  const removeFromCart = (serviceId) => {
    setCart((prev) => prev.filter((i) => i.serviceId !== serviceId));
  };

  const updateCartQty = (serviceId, delta) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.serviceId === serviceId) {
            const nextQty = i.qty + delta;
            return nextQty > 0 ? { ...i, qty: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // --------------------------------------------------------------------------
  // DRAWERS & MODALS
  // --------------------------------------------------------------------------
  const openDrawer = (name, bookingId = null) => {
    if (name === 'tracker' && bookingId) {
      setActiveTrackerBookingId(bookingId);
    }
    setDrawers({
      car: false,
      cart: false,
      checkout: false,
      tracker: false,
      [name]: true,
    });
  };

  const closeDrawer = (name) => {
    setDrawers((prev) => ({ ...prev, [name]: false }));
  };

  const closeAllDrawers = () => {
    setDrawers({
      car: false,
      cart: false,
      checkout: false,
      tracker: false,
    });
  };

  // --------------------------------------------------------------------------
  // ORDERS & BOOKING CONFIRMATION
  // --------------------------------------------------------------------------
  const activeTrackerBooking = useMemo(() => {
    if (!bookings.length) return null;
    if (activeTrackerBookingId) {
      const found = bookings.find((b) => b.id === activeTrackerBookingId);
      if (found) return found;
    }
    return bookings[0];
  }, [bookings, activeTrackerBookingId]);

  const confirmBooking = async (checkoutFormData) => {
    if (!activeVehicle || !cart.length) return;

    try {
      const serviceIds = cart.map((i) => i.serviceId);
      const payload = {
        vehicleId: activeVehicle.id,
        serviceIds,
        pickupOption: checkoutFormData.pickupType === 'self' ? 'self' : 'pickup',
        slot: `${checkoutFormData.slotDate || 'Tomorrow'} · ${checkoutFormData.slotTime || '09:30 AM - 10:30 AM'}`,
        address: checkoutFormData.address || '',
        paymentMode: 'pay_after_service',
      };

      const res = await orderAPI.createOrder(payload);
      if (res.success && res.order) {
        const norm = normalizeOrder(res.order);
        setBookings((prev) => [norm, ...prev]);
        setCart([]);
        closeAllDrawers();
        setActiveTrackerBookingId(norm.id);
        setTimeout(() => {
          openDrawer('tracker', norm.id);
        }, 150);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to place booking order.';
      alert(msg);
      console.error('Order creation error:', err);
    }
  };

  // Handle Approve Extra Work
  const approveExtraWork = async (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking || !booking.extraWork) return;

    try {
      const extraId = booking.extraWork.extraId || booking.extraWork.id;
      const res = await orderAPI.decideExtra(bookingId, extraId, 'approve');
      if (res.success && res.order) {
        const norm = normalizeOrder(res.order);
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? norm : b)));
      }
    } catch (err) {
      console.error('Failed approving extra work:', err);
    }
  };

  // Handle Decline Extra Work
  const declineExtraWork = async (bookingId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking || !booking.extraWork) return;

    try {
      const extraId = booking.extraWork.extraId || booking.extraWork.id;
      const res = await orderAPI.decideExtra(bookingId, extraId, 'decline');
      if (res.success && res.order) {
        const norm = normalizeOrder(res.order);
        setBookings((prev) => prev.map((b) => (b.id === bookingId ? norm : b)));
      }
    } catch (err) {
      console.error('Failed declining extra work:', err);
    }
  };

  // --------------------------------------------------------------------------
  // POLLING: Poll active order every 10 seconds while Tracker Drawer is open
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!drawers.tracker || !activeTrackerBookingId) return;

    const pollOrder = async () => {
      try {
        const res = await orderAPI.getOrder(activeTrackerBookingId);
        if (res.success && res.order) {
          const norm = normalizeOrder(res.order);
          setBookings((prev) =>
            prev.map((b) => (b.id === activeTrackerBookingId ? norm : b))
          );
        }
      } catch (err) {
        console.warn('Tracker polling error:', err.message);
      }
    };

    // Poll immediately, then every 10 seconds
    pollOrder();
    const interval = setInterval(pollOrder, 10000);

    return () => clearInterval(interval);
  }, [drawers.tracker, activeTrackerBookingId]);

  const value = {
    // Auth
    currentUser,
    isLoggedIn: !!currentUser,
    authLoading,
    authError,
    registerUser,
    loginUser,
    logoutUser,

    // Vehicles
    vehicles,
    activeVehicle,
    activeVehicleId,
    vehiclesLoading,
    addVehicle,
    editVehicle,
    deleteVehicle,
    setActiveVehicle,
    fetchVehicles,

    // Services Catalog & Cart
    catalogServices,
    servicesLoading,
    cart,
    cartCount: cart.reduce((sum, i) => sum + i.qty, 0),
    cartSubtotal,
    cartGst,
    cartTotal,
    addToCart,
    removeFromCart,
    updateCartQty,
    clearCart,

    // Drawers
    drawers,
    openDrawer,
    closeDrawer,
    closeAllDrawers,

    // Bookings & Tracker
    bookings,
    ordersLoading,
    activeTrackerBooking,
    activeTrackerBookingId,
    confirmBooking,
    approveExtraWork,
    declineExtraWork,
    fetchOrders,

    // Preview Mode
    previewMode,
    setPreviewMode,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
