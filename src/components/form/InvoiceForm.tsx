"use client";

import React, { useRef } from "react";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { Input } from "@/components/ui/Input";
import { MapPin, Phone, Mail, Building, Globe, Hash, Calendar, Upload, Trash2 } from "lucide-react";
import { LineItemsEditor } from "./LineItemsEditor";

export function InvoiceForm() {
  const {
    invoiceMetadata,
    senderDetails,
    clientDetails,
    financials,
    paymentDetails,
    updateMetadata,
    updateSender,
    updateClient,
    updateFinancials,
    updatePayment,
    notes,
    termsAndConditions,
    updateNotes,
    updateTerms
  } = useInvoiceStore();
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateSender({ logoBase64: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    updateSender({ logoBase64: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-10">
      {/* Settings / Metadata */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Invoice Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input 
            label="Invoice Number" 
            icon={<Hash className="w-4 h-4" />} 
            value={invoiceMetadata.invoiceNumber}
            onChange={(e) => updateMetadata({ invoiceNumber: e.target.value })}
          />
          <Input 
            label="Currency" 
            value={invoiceMetadata.currency}
            onChange={(e) => updateMetadata({ currency: e.target.value })}
            placeholder="e.g. USD, EUR, BDT"
          />
          <Input 
            label="Issue Date" 
            type="date"
            icon={<Calendar className="w-4 h-4" />} 
            value={invoiceMetadata.issueDate}
            onChange={(e) => updateMetadata({ issueDate: e.target.value })}
          />
          <Input 
            label="Due Date" 
            type="date"
            icon={<Calendar className="w-4 h-4" />} 
            value={invoiceMetadata.dueDate}
            onChange={(e) => updateMetadata({ dueDate: e.target.value })}
          />
        </div>
      </section>

      {/* Sender Details */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Your Details (Sender)</h2>
        <div className="mb-6 flex items-start gap-5">
          <div className="flex-1 space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Company Logo</label>
            <div className="flex items-center gap-4">
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium rounded-lg transition-colors"
              >
                <Upload className="w-4 h-4" />
                Upload Image
              </button>
              {senderDetails.logoBase64 && (
                <button
                  type="button"
                  onClick={removeLogo}
                  className="flex items-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-medium rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500">Recommended: Square or horizontal logo (PNG, JPG).</p>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleLogoUpload}
            />
          </div>
          {senderDetails.logoBase64 && (
            <div className="w-20 h-20 rounded-lg border border-slate-200 p-2 flex items-center justify-center bg-white shadow-sm shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={senderDetails.logoBase64} alt="Company Logo" className="max-w-full max-h-full object-contain" />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input 
            label="Company Name" 
            icon={<Building className="w-4 h-4" />} 
            value={senderDetails.companyName}
            onChange={(e) => updateSender({ companyName: e.target.value })}
          />
          <Input 
            label="Website" 
            icon={<Globe className="w-4 h-4" />} 
            value={senderDetails.website}
            onChange={(e) => updateSender({ website: e.target.value })}
          />
          <Input 
            label="Email" 
            type="email"
            icon={<Mail className="w-4 h-4" />} 
            value={senderDetails.email}
            onChange={(e) => updateSender({ email: e.target.value })}
          />
          <Input 
            label="Phone" 
            icon={<Phone className="w-4 h-4" />} 
            value={senderDetails.phone}
            onChange={(e) => updateSender({ phone: e.target.value })}
          />
          <div className="md:col-span-2">
            <Input 
              label="Address" 
              icon={<MapPin className="w-4 h-4" />} 
              value={senderDetails.address}
              onChange={(e) => updateSender({ address: e.target.value })}
            />
          </div>
        </div>
      </section>

      {/* Client Details */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Client Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input 
            label="Client / Company Name" 
            icon={<Building className="w-4 h-4" />} 
            value={clientDetails.companyName || clientDetails.clientName}
            onChange={(e) => updateClient({ companyName: e.target.value, clientName: e.target.value })}
            placeholder="Acme Corp"
          />
          <Input 
            label="Client Email" 
            type="email"
            icon={<Mail className="w-4 h-4" />} 
            value={clientDetails.clientEmail}
            onChange={(e) => updateClient({ clientEmail: e.target.value })}
            placeholder="client@acme.com"
          />
          <Input 
            label="Client Phone" 
            icon={<Phone className="w-4 h-4" />} 
            value={clientDetails.phone}
            onChange={(e) => updateClient({ phone: e.target.value })}
            placeholder="+1 987 654 3210"
          />
          <div className="md:col-span-2">
            <Input 
              label="Client Address" 
              icon={<MapPin className="w-4 h-4" />} 
              value={clientDetails.address}
              onChange={(e) => updateClient({ address: e.target.value })}
              placeholder="456 Client St, Metro City"
            />
          </div>
        </div>
      </section>

      {/* Line Items */}
      <LineItemsEditor />

      {/* Financials & Payment */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Totals & Taxes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Discount Type</label>
            <select 
              className="flex h-10 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              value={financials.discountType}
              onChange={(e) => updateFinancials({ discountType: e.target.value as 'percentage' | 'fixed' })}
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount</option>
            </select>
          </div>
          <Input 
            label={`Discount Value ${financials.discountType === 'percentage' ? '(%)' : ''}`}
            type="number" 
            min="0"
            value={financials.discountValue}
            onChange={(e) => updateFinancials({ discountValue: parseFloat(e.target.value) || 0 })}
          />
          <Input 
            label="Tax Rate (%)" 
            type="number" 
            min="0"
            value={financials.taxRate}
            onChange={(e) => updateFinancials({ taxRate: parseFloat(e.target.value) || 0 })}
          />
          <Input 
            label="Shipping Costs" 
            type="number" 
            min="0"
            value={financials.shipping}
            onChange={(e) => updateFinancials({ shipping: parseFloat(e.target.value) || 0 })}
          />
          <div className="md:col-span-2">
            <Input 
              label="Amount Already Paid" 
              type="number" 
              min="0"
              value={financials.amountPaid}
              onChange={(e) => updateFinancials({ amountPaid: parseFloat(e.target.value) || 0 })}
            />
          </div>
        </div>

        <hr className="border-slate-100 my-8"/>

        <h2 className="text-lg font-semibold text-slate-900 mb-6">Payment Instructions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input 
            label="Payment Method" 
            value={paymentDetails.method}
            onChange={(e) => updatePayment({ method: e.target.value })}
            placeholder="e.g. Bank Transfer"
          />
          <Input 
            label="Bank Name" 
            value={paymentDetails.bankName}
            onChange={(e) => updatePayment({ bankName: e.target.value })}
          />
          <Input 
            label="Account Name" 
            value={paymentDetails.accountName}
            onChange={(e) => updatePayment({ accountName: e.target.value })}
          />
          <Input 
            label="Account Number" 
            value={paymentDetails.accountNumber}
            onChange={(e) => updatePayment({ accountNumber: e.target.value })}
          />
          <Input 
            label="Routing / IBAN" 
            value={paymentDetails.iban}
            onChange={(e) => updatePayment({ iban: e.target.value })}
          />
          <Input 
            label="SWIFT / BIC" 
            value={paymentDetails.swift}
            onChange={(e) => updatePayment({ swift: e.target.value })}
          />
        </div>
      </section>

      {/* Notes */}
      <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Additional Notes</h2>
        <div className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Notes Custom Message</label>
            <textarea 
              className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 min-h-[100px]"
              value={notes}
              onChange={(e) => updateNotes(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Terms and Conditions</label>
            <textarea 
              className="flex w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 min-h-[100px]"
              value={termsAndConditions}
              onChange={(e) => updateTerms(e.target.value)}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
