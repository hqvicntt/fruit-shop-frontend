# 🖥️ Fruit Shop Management System - Admin Dashboard

![React](https://img.shields.io/badge/React-2026-blue?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel&logoColor=white)

A responsive Single Page Application (SPA) built with ReactJS and Bootstrap 5 for store administrators to manage fruit inventory, adjust daily prices, and monitor historical revenue reports.

---

## ✨ Key Features

- **Protected Admin Access:** Prevents unauthorized access with a login gate, persisting `Bearer Tokens` securely via `localStorage` and attaching them to Axios requests.
- **Real-Time Inventory Control:** Add new fruits, edit prices or stock quantities via interactive Bootstrap modals, and remove out-of-season items.
- **Daily Revenue & Transaction Filtering:** View total revenue, cash collected, and QR bank transfers through summary cards, complete with a date picker to inspect historical orders.
- **Responsive Design:** Clean, mobile-friendly layout powered by Bootstrap 5 Grid System.

---

## 🚀 Local Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hqvicntt/fruit-shop-frontend
   cd fruit-shop-frontend
   ```
2. **Install Node.js packages:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   Create a `.env` file in the root directory and specify your backend API base URL:
   ```env
   VITE_API_URL=http://localhost:8000
   ```
4. **Start the Vite development server:**
   ```bash
   npm run dev
   ```

---

## 👨‍💻 Author

- **Huynh Quang Vi** – Information Technology Student, Can Tho University (CTU).

---
