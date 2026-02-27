# JanSetu SUVIDHA: Unified Civic Services Portal

![JanSetu Kiosk Interface](frontend/public/vite.svg)<!-- Replace with actual project screenshot if available -->

**JanSetu SUVIDHA** (सुगम सेवा • सुदृढ़ समाज) is a comprehensive, touch-optimized public kiosk interface designed to bridge the digital divide and provide citizens with seamless access to essential government and civic services.

Inspired by the clean, accessible, and highly trusted UIDAI design language, JanSetu offers a premium, localized, and highly secure user experience tailored for physical kiosk deployments.

## 🚀 Key Features

### 🌐 Comprehensive Localization
- **Multilingual Support:** Supports 10+ regional languages (Hindi, Marathi, Tamil, Telugu, Bengali, Gujarati, Kannada, Malayalam, Punjabi, Odia, Assamese, Urdu) alongside English.
- **Dynamic Switching:** Real-time language switching using `i18next`.

### 🛡️ Secure & Verified Identity
- **Aadhaar-Based Authentication:** Emulates a highly secure Aadhaar + OTP login flow.
- **Session Management:** Secure idle timeout with automatic logout and dynamic idle screen carousel to protect user privacy.

### 🏛️ Civic Services Suite
- **Utility Bill Payments:** Instantly fetch and pay Electricity, Gas, Water, Waste, and Property Tax bills.
- **Grievance Registration:** Report local issues (water leaks, power outages, etc.) with Ward/Location tagging and integrated virtual keyboard.
- **Application Tracking:** Real-time status tracking for grievances and requests using reference IDs.
- **Document Management:** Securely view and download official documents (Aadhaar, PAN, Voter ID).

### 🖥️ Kiosk-Optimized UI/UX
- **Touch-First Design:** Large touch targets, vivid visual hierarchy, and intuitive navigation flows designed specifically for kiosk touchscreens.
- **Virtual On-Screen Keyboard:** Custom-built intelligent virtual keyboard with both Numeric (for OTP/Aadhaar) and full QWERTY modes (for text input) optimized for physical kiosks without external peripherals.
- **UIDAI Design System:** Premium glassmorphism effects, crisp typography, and high-contrast color palettes ensuring accessibility and trust.
- **Dual Dashboards:** 
  - **Citizen Dashboard:** Personalized access to civic services via a beautiful Bento-grid layout.
  - **Admin Dashboard:** Centralized monitor for kiosk health, live status, and content management.

## 🛠️ Technology Stack

- **Frontend Framework:** [React 18](https://reactjs.org/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Routing:** [React Router v6](https://reactrouter.com/)
- **Internationalization:** [react-i18next](https://react.i18next.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Styling:** Vanilla CSS3 (Custom Properties, Flexbox, Grid, CSS Modules architecture)

## 📂 Project Structure

```
JanSetu/
├── frontend/
│   ├── public/              # Static assets and locales (i18n JSON files)
│   ├── src/
│   │   ├── components/      # Reusable UI components (VirtualKeyboard, Layout, etc.)
│   │   ├── pages/           # Application views (Auth, Dashboard, Grievance, etc.)
│   │   ├── App.jsx          # Main application routing & context provider
│   │   ├── i18n.js          # i18next configuration
│   │   ├── index.css        # Global CSS variables and UIDAI design system
│   │   └── main.jsx         # React application entry point
│   ├── package.json         # Project dependencies
│   └── vite.config.js       # Vite configuration
└── Extras/                  # Project documentation and resources
```

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16.0 or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd JanSetu/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to `http://localhost:5173` to view the application.

## 🎨 Design Philosophy

JanSetu leverages a structural styling approach heavily optimized for **public trust and ease of use**:
- **Tricolor Identity:** Subtle integration of the Indian tricolor as a premium gradient indicator across the application header indicates official association.
- **Motion & Micro-interactions:** Smooth `fade-in` and `scale-in` animations provide vital feedback for touch interactions without overwhelming the user.
- **Accessibility (a11y):** High contrast text (`#1a1a2e`), distinct primary (`#0B5394`) and success (`#15803D`) action colors, and clear iconography.

## 🤝 Contributing
This project is currently developed as part of a Hackathon prototype (Phase 1). Future phases will involve deep backend API integrations, real-time database management, and hardware peripheral linkage (e.g., thermal printers, barcode scanners).
