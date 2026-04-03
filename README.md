# Itversee Invoice Generator

A professional invoice generator web application where users can input company and client details, add line items, and seamlessly generate and download vector-rendered PDF invoices.

🌐 **Live Demo:** [https://invoice-generator-bd.vercel.app](https://invoice-generator-bd.vercel.app)

## Tech Stack
- **Frontend:** Next.js (App Router), React 19
- **Styling:** Tailwind CSS v4, Lucide React
- **State Management:** Zustand
- **PDF Generation:** React-to-Print

## Features
- **Dynamic Real-Time Preview:** The A4 invoice matches your inputs synchronously in a slick split-screen layout.
- **Line Items Editor:** Dynamically add items and let the app automatically calculate Subtotals, Discounts (Percentage or Fixed), Taxes, and the Balance Due.
- **Customizable Logo:** Upload your company logo directly into the interface and have it beautifully rendered on the receipt.
- **True Vector PDF Exports:** Powered by native browser printing (`react-to-print`), making the generated PDFs crisp and ensuring text is perfectly highlightable/searchable.
- **JSON Export:** Download your generated invoice data as JSON for bookkeeping matching the specified schema.

## Getting Started

First, install dependencies:

```bash
npm install
# or
yarn install
```

Run the development server natively:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application in action.

## Deployment

The app is optimized for deploying on the [Vercel Platform](https://vercel.com/new). Deploy seamlessly by importing your repository.
