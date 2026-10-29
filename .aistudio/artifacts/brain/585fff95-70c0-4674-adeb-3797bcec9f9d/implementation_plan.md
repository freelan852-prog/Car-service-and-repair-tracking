# AutoTrust — Transparent Car Service & Booking Platform (Revised)

AutoTrust is a customer-facing car service booking web application built with React (plain JavaScript / JSX) and Tailwind CSS. It features car category and fuel-type dependent pricing, a single-sheet streamlined checkout with "Pay after service", automatic price locking upon booking confirmation, and an interactive tracking panel with stage advancement and extra-work approval simulators.

> [!IMPORTANT]
> **Revised Requirements & Architecture Decisions:**
> - **Language & Routing**: Plain JavaScript (`.jsx`), using **React Router** for page routing (`/`, `/services`, `/contact`).
> - **Drawers & Overlays**: Cart, Car Selector/Adder, Single-Sheet Checkout, and Booking Tracker open as slide-in drawers/panels over the current route.
> - **Pricing Model**: Prices dynamically adjust based on both **Vehicle Category** (Hatchback, Sedan, SUV, Luxury) **AND Fuel Type** (Petrol, Diesel, CNG, EV).
> - **Single-Sheet Checkout**: Unified single sheet with pickup/drop-off address toggle, preferred date/time slot, payment method fixed to "Pay after service (at workshop)", and a single "Confirm & Lock Price" button.
> - **Price Lock Behavior**: The estimate price is locked once upon booking confirmation (no separate preparatory lock step).
> - **Tracking Panel**: Interactive live workshop stages with "Demo: next stage" button, "Add extra-work request" button, photo inspection placeholders, and real-time Approve / Decline actions for extra work with automatic estimate recalculation.
> - **Content Authenticity**: All sample content clearly labeled as "demo" (no fake testimonials or unrealistic 100% guarantees).
> - **Viewports**: Dedicated Desktop vs. Mobile preview toggle retained for testing layouts.

---

## 1. Overview & Core Concept

- **What It Does**: AutoTrust provides car owners with an honest, predictable service booking experience. Customers select their car model and fuel type to see accurate maintenance costs in Indian Rupees (`₹`), add services to their estimate cart, confirm their booking in a single-step sheet, and track their car's repair status with simulated bay progression and extra-work approvals.
- **Target Audience**: Car owners seeking clear, upfront maintenance estimates without hidden charges.
- **Key Value**: Predictable prices calculated for the customer's specific car and fuel type, locked at booking confirmation, with full customer control over any extra repairs.

---

## 2. User Experience & Visual Design

### Key Routes & User Flows

1. **Top Navigation Bar**:
   - Brand Wordmark: **AutoTrust** (Deep Sovereign Navy `#0B1F3A` in Plus Jakarta Sans).
   - Navigation links: **Home** (`/`), **Services** (`/services`), **Contact/Helpline** (`/contact`).
   - Car Switcher dropdown/button showing active car (e.g. *"Maruti Swift · Petrol"*).
   - Cart icon with live badge counter.
   - "Track Booking" status pill (active when a booking is confirmed).
   - Top-right Desktop / Mobile preview mode switcher.

2. **Home Page (`/`)**:
   - Hero section with car selector widget (Choose Make, Model, Fuel Type, and enter License Plate e.g. `MH 02 DX 4821`).
   - Core Value Pillars: Upfront Segment & Fuel-based Pricing, Price Locked at Confirmation, Pay After Service, Customer Approval Required for Extra Work.
   - Popular Service Packages spotlight with instant "Add to Estimate" and "Customize" buttons.
   - Simple demo informational cards describing the service workflow.

3. **Services Catalog (`/services`)**:
   - Category filtering (Periodic Maintenance, Brakes, AC & Cooling, Tyres & Wheels, Detailing).
   - Service cards displaying dynamic prices in `₹` tabular numbers based on active car category & fuel type.
   - Itemized inclusions list (e.g., Synthetic Engine Oil, Filter Replacement, 40-Point Inspection).
   - Quick "Add to Cart" action with instant numeric cart increment feedback.

4. **Contact & Helpline (`/contact`)**:
   - Customer support helpline numbers and email inquiry form (demo submission with confirmation state).
   - Service FAQ addressing pricing, fuel type differences, and cancellation policies.

5. **Drawers & Panels (Slide-In Overlays)**:
   - **Car Switcher Drawer**: Select from pre-configured demo cars or add a new car with Make, Model, Category, Fuel Type (Petrol, Diesel, CNG, EV), and license plate.
   - **Cart Drawer**: Itemized list of added services, quantity adjusters, subtotal, GST/taxes, and "Proceed to Checkout" button.
   - **Single-Sheet Checkout Drawer**:
     - Pickup & Drop-off: Toggle between "Doorstep Pickup & Drop" and "Self-Drop at Workshop" with address fields.
     - Service Date & Time Slot selection.
     - Payment Notice: *"Pay after service at workshop (Cash, Card, or UPI accepted upon delivery)"*.
     - Action: Primary **"Confirm & Lock Price"** button that immediately creates the booking, locks the price, and opens the Tracking Panel.
   - **Booking Tracker Panel**:
     - Status Tracker: Visual milestone steps (*Received $\to$ Initial Inspection $\to$ Service in Progress $\to$ Final Inspection $\to$ Ready for Delivery*).
     - **Locked Price Guarantee Card**: Prominent locked amount (`₹ XX,XXX`) established at confirmation.
     - **Demo Controls**:
       - `"Demo: next stage"`: Advances the booking status step.
       - `"Add extra-work request"`: Simulates a technician finding an unexpected worn component (e.g., Front Brake Pad wear at 85%), adding a photo placeholder card with price (`₹ 1,450`) and interactive **"Approve"** / **"Decline"** buttons.
       - Approving or declining immediately updates the final payable amount and records the decision.

---

## 3. Key Product Decisions & Trade-Offs

- **Plain JavaScript (JSX) with React Router**:
  - *Chosen Approach*: Write components in `.jsx` using `react-router-dom` for client routing (`/`, `/services`, `/contact`).
  - *Why*: Directly aligns with user requirement for plain JavaScript (JSX) without TypeScript overhead.
- **Single-Sheet Checkout**:
  - *Chosen Approach*: All checkout inputs (delivery mode, address, date/time) reside in one clean, scrollable slide-over sheet.
  - *Why*: Reduces cognitive friction and eliminates multi-step wizards.
- **Locked Price on Confirmation**:
  - *Chosen Approach*: Estimate remains editable in the cart; once the user clicks "Confirm & Lock Price" in checkout, the booking is established and the locked rate badge becomes immutable (except for user-approved extra items).
- **Interactive Demo Capabilities**:
  - *Chosen Approach*: Built-in demo simulation buttons ("Demo: next stage" and "Add extra-work request") directly in the tracking drawer.
  - *Why*: Allows the user to thoroughly test real-time state mutations, extra-work approval flows, and invoice recalculations without needing a backend server.

---

## 4. Technical Architecture & State Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AutoTrust (React + JSX)                         │
├────────────────────────────────────────────────────────────────────────┤
│  Top Bar: [Wordmark] — [Home | Services | Contact] — [Car] [Cart] [Track]
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│  <Routes>                                                              │
│    ├── Route path="/"          -> <Home />                             │
│    ├── Route path="/services"  -> <Services />                         │
│    └── Route path="/contact"   -> <Contact />                          │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│                       Global State Store (Context)                     │
│  • activeCar: { id, make, model, category, fuel, plate }               │
│  • cart: [ { serviceId, title, basePrice, calculatedPrice, qty } ]     │
│  • activeBooking: { id, status, lockedPrice, extraWork: [...] }        │
│  • drawers: { cart: bool, car: bool, checkout: bool, tracker: bool }   │
│  • previewMode: 'desktop' | 'mobile'                                   │
├────────────────────────────────────────────────────────────────────────┤
│                    Overlay Drawers (Slide-In Panels)                   │
│  ┌────────────────┐  ┌───────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │  Car Switcher  │  │  Cart Drawer  │  │ Single-Sheet │  │ Booking  │ │
│  │ • Category     │  │ • Item list   │  │ Checkout     │  │ Tracker  │ │
│  │ • Fuel Type    │  │ • Subtotal    │  │ • Pickup/Drop│  │ • Stages │ │
│  │ • Model picker │  │ • To Checkout │  │ • Slot / Date│  │ • Next   │ │
│  │                │  │               │  │ • Pay Later  │  │   Stage  │ │
│  │                │  │               │  │ • Confirm &  │  │ • Add    │ │
│  │                │  │               │  │   Lock Price │  │   Work   │ │
│  └────────────────┘  └───────────────┘  └──────────────┘  └──────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

### Component Files (JSX)
1. `src/data/mockData.js`: Vehicle categories, fuel multipliers, and service catalog with clear "demo" labels.
2. `src/context/AppContext.jsx`: App state (car selection, pricing calculations, cart mutations, checkout submission, tracker simulation).
3. `src/components/Navbar.jsx`: 3-zone header with route links, car switcher indicator, cart drawer trigger, and tracker launcher.
4. `src/pages/HomePage.jsx`: Landing hero with vehicle configuration widget, demo value highlights, and popular services.
5. `src/pages/ServicesPage.jsx`: Filterable catalog with dynamic car & fuel calculated pricing.
6. `src/pages/ContactPage.jsx`: Helpline info, demo callback form, and FAQs.
7. `src/components/drawers/VehicleDrawer.jsx`: Car selector and addition form.
8. `src/components/drawers/CartDrawer.jsx`: Slide-in cart with itemized services and proceed button.
9. `src/components/drawers/CheckoutDrawer.jsx`: Single-sheet checkout with pickup options, time slots, and "Confirm & Lock Price".
10. `src/components/drawers/TrackerDrawer.jsx`: Workshop stage progress, photo placeholders, "Demo: next stage" button, and "Add extra-work request" button with Approve/Decline.
11. `src/components/PreviewWrapper.jsx`: Toggle between Desktop full-width layout and Mobile phone frame.
