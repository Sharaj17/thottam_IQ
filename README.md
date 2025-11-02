# 🌿 Thottam Organics — Digital Order Form (Zero Overhead)

### A simple, free, and effective digital ordering solution for small-scale businesses.

---

## 💡 What We Built

We transformed a **manual Excel price list** into a **fully functional digital storefront** — a single-page web app connected to a Google Sheet or OneDrive Excel file.  

- ✅ Customers can search for products, view live prices, and place orders.
- ✅ Orders automatically generate an order number and send an email notification.
- ✅ No database, no monthly SaaS fees, no developer subscription required.
- ✅ Everything runs on free tiers — Flask (Python), Google Sheets, and Gmail.

This project empowers **small and local businesses** to **go digital instantly** with **zero overhead** — no need to pay for Shopify, inventory systems, or hosting subscriptions.

---

## 🎯 Who This Helps

This is designed for:
- Farmers, co-ops, and small organic brands.
- Home-grown food, spice, or product sellers.
- Any small business managing prices in Excel or Google Sheets.

With this, they can:
- Share one Google Sheet for product and price management.
- Automatically display live prices on their order page.
- Collect orders digitally without manual follow-ups.

---

## ⚙️ How It Works

1. **Your price list** lives in Google Sheets or OneDrive as a simple two-column table:  
   | Product | Price |  
   |----------|-------|  
   | Pepper (Black Whole) | 199 |  
   | Turmeric Powder | 129 |  

2. **The backend (Flask app)** fetches this data live via your public share link.  
   It supports both `.csv` (Google Sheets export) and `.xlsx` (Excel in Drive/OneDrive).

3. **The frontend (index.html)** lets customers:
   - Type a product name → it autocompletes from the sheet.  
   - Enter quantity → price and totals update instantly.  
   - Submit order → an order number is generated and sent to your email.

4. **The order summary email** includes customer details, items, prices, totals, and a timestamp.

---

## 🧩 Project Structure

```
project/
├── backend.py        # Flask backend server
├── index.html        # Single-page frontend
├── script.js         # Client-side logic
├── style.css         # Theme and layout
├── .env              # Configuration file (see below)
└── requirements.txt  # Flask + openpyxl + dotenv + requests
```

---

## 🔧 Setup Guide

### 1. Create a `.env` file in the project root

Copy this exact template and fill in your details 👇  

```ini
# === Data source ===
# Paste a public/shared link to your file on Google Drive or OneDrive.
PRODUCT_SHEET_URL=<provide google sheet url here>

# Optional tuning (defaults shown)
SHEET_NAME=item_price          # for .xlsx only; ignored for CSV
HAS_HEADER=true                # set true if your sheet's first row is headers
PRODUCT_COL=0                  # 0-based column index for product name
PRICE_COL=1                    # 0-based column index for price
CACHE_TTL_SECONDS=300          # cache products in memory for 5 minutes

# === Email (used to send order notification) ===
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
EMAIL_ADDRESS=<enter EMAIL ID here>
EMAIL_PASSWORD=<enter APP PASSWORD>
```

> **Tip:**  
> For Google Sheets, convert your URL like this:  
> ```
> https://docs.google.com/spreadsheets/d/<SHEET_ID>/export?format=csv
> ```

### 2. Start the backend

```bash
python backend.py
```

Visit [http://127.0.0.1:5000](http://127.0.0.1:5000) in your browser.

---

## 🧠 Example Workflow

1. You update product prices in Google Sheets.  
2. The backend automatically fetches the latest CSV data.  
3. The customer visits your site, selects items, and submits an order.  
4. You receive an email instantly with:
   - Customer details  
   - Product list  
   - Quantities  
   - Total price  
   - Order number and timestamp  

No database or hosting subscription needed — **your spreadsheet is your inventory**.

---

## 💌 Deploying for Free

- **Render / Railway / Deta Space:** Deploy Flask for free (auto HTTPS).  
- **Google Drive / Sheets:** Already free.  
- **Email:** Use a Gmail App Password (not your personal password).

Combine these, and your business has a **fully digital storefront for ₹0**.

---

## 🧾 Example Email Notification

```
Order No: THO-20251102-1234
Timestamp: 2025-11-02T17:22:00

Customer:
Name: Anil Kumar
Phone: 9876543210
Address:
  12B, Thottam Villa
  Green Street
  Kochi
  682020

Items:
- Pepper (Black Whole) x 2 @ 199.00 = 398.00
- Turmeric Powder x 1 @ 129.00 = 129.00

Total: ₹527.00
```

---

## 🪴 Why It Matters

Most small businesses hesitate to go digital because of:
- High software costs
- Technical complexity
- Fear of losing data control

This project removes all of that:
- **You own the data** (it’s just your spreadsheet).
- **You own the brand** (custom logo, fonts, colors).
- **You own the communication** (email directly to you).

A full e-commerce workflow — **without paying a rupee to anyone**.

---

## ❤️ Built for Simplicity

We made this for **Thottam Organics**, but it can easily be adapted to:
- Any small brand with a Google Sheet price list
- Non-profits, co-ops, local suppliers
- Schools, canteens, or neighborhood vendors

Fork it, brand it, and make it your own.

---

**“Empowering small-scale businesses to go digital — one spreadsheet at a time.”**
