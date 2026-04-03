"use client";

import React, { useRef, useState } from "react";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { formatCurrency } from "@/lib/utils";
import { format, parseISO } from "date-fns";
import { Download, FileJson } from "lucide-react";
import { useReactToPrint } from "react-to-print";

export function InvoicePreview() {
  const store = useInvoiceStore();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const safeFormatDate = (dateString: string) => {
    try {
      if (!dateString) return "";
      return format(parseISO(dateString), "MMM dd, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  const handleExportPDF = useReactToPrint({
    contentRef: invoiceRef,
    documentTitle: store.invoiceMetadata.invoiceNumber,
    pageStyle: `
      @page { size: auto; margin: 0mm; }
      @media print { 
        body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } 
        .print\\:hidden { display: none !important; }
      }
    `
  });

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(store, null, 2));
    const downloadAnchorNode = document.createElement("a");
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${store.invoiceMetadata.invoiceNumber}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const subTotal = store.getSubTotal();
  const discountAmount = store.getDiscountAmount();
  const taxAmount = store.getTaxAmount();
  const grandTotal = store.getGrandTotal();
  const balanceDue = store.getBalanceDue();
  const currency = store.invoiceMetadata.currency;

  return (
    <div className="w-full h-full flex flex-col gap-6 items-center">
      <div className="flex gap-4 self-end w-full max-w-[800px] justify-end export-buttons">
        <button
          onClick={handleExportJSON}
          className="flex items-center gap-2 bg-white text-slate-700 px-4 py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm font-medium text-sm"
        >
          <FileJson className="w-4 h-4" />
          Export JSON
        </button>
        <button
          onClick={handleExportPDF}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20 font-medium text-sm"
        >
          <Download className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      {/* A4 Paper Container */}
      <div className="bg-white shadow-xl shadow-slate-200/50 rounded-lg overflow-hidden w-full max-w-[800px]">
        {/* Render Target for PDF */}
        <div 
          ref={invoiceRef}
          className="bg-white text-slate-800 p-10 sm:p-14 md:p-16 min-h-[1056px] w-full box-border relative font-sans"
        >
          {/* Header Banner */}
          <div className="absolute top-0 left-0 right-0 h-4 bg-indigo-600 print:hidden" />
          
          <div className="flex justify-between items-start pt-4">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">INVOICE</h1>
              <p className="text-slate-500 mt-1 font-medium">{store.invoiceMetadata.invoiceNumber}</p>
            </div>
            <div className="text-right flex flex-col items-end">
              {store.senderDetails.logoBase64 ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img 
                  src={store.senderDetails.logoBase64} 
                  alt={store.senderDetails.companyName} 
                  className="h-16 w-auto object-contain mb-2" 
                />
              ) : (
                <h2 className="text-xl font-bold text-slate-900">{store.senderDetails.companyName}</h2>
              )}
              <div className="text-sm text-slate-500 mt-1 flex flex-col gap-0.5">
                {store.senderDetails.address && <p>{store.senderDetails.address}</p>}
                {store.senderDetails.phone && <p>{store.senderDetails.phone}</p>}
                {store.senderDetails.email && <p>{store.senderDetails.email}</p>}
                {store.senderDetails.website && <p>{store.senderDetails.website}</p>}
              </div>
            </div>
          </div>

          <div className="mt-14 flex justify-between items-start">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To</p>
              <h3 className="text-lg font-semibold text-slate-800">
                {store.clientDetails.companyName || store.clientDetails.clientName || 'Client Name'}
              </h3>
              {(store.clientDetails.companyName && store.clientDetails.clientName) && (
                <p className="text-sm text-slate-600">{store.clientDetails.clientName}</p>
              )}
              <div className="text-sm text-slate-500 mt-1 flex flex-col gap-0.5">
                {store.clientDetails.address && <p>{store.clientDetails.address}</p>}
                {store.clientDetails.clientEmail && <p>{store.clientDetails.clientEmail}</p>}
                {store.clientDetails.phone && <p>{store.clientDetails.phone}</p>}
              </div>
            </div>
            <div className="text-right">
              <div className="mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Date of Issue</p>
                <p className="text-sm font-medium text-slate-800">{safeFormatDate(store.invoiceMetadata.issueDate)}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Due Date</p>
                <p className="text-sm font-medium text-slate-800">{safeFormatDate(store.invoiceMetadata.dueDate)}</p>
              </div>
            </div>
          </div>

          <div className="mt-14">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-y border-slate-200">
                  <th className="py-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-[50%]">Description</th>
                  <th className="py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Qty</th>
                  <th className="py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Price</th>
                  <th className="py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {store.lineItems.map((item) => (
                  <tr key={item.id}>
                    <td className="py-4 text-sm font-medium text-slate-800">{item.description || '-'}</td>
                    <td className="py-4 text-sm text-slate-600 text-right">{item.quantity}</td>
                    <td className="py-4 text-sm text-slate-600 text-right">{formatCurrency(item.unitPrice, currency)}</td>
                    <td className="py-4 text-sm font-medium text-slate-800 text-right">{formatCurrency(item.amount, currency)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex justify-end">
            <div className="w-full max-w-sm">
              <div className="flex justify-between py-2 text-sm text-slate-600">
                <span>Subtotal</span>
                <span>{formatCurrency(subTotal, currency)}</span>
              </div>
              {store.financials.discountValue > 0 && (
                <div className="flex justify-between py-2 text-sm text-slate-600">
                  <span>Discount {store.financials.discountType === 'percentage' && `(${store.financials.discountValue}%)`}</span>
                  <span className="text-red-500">-{formatCurrency(discountAmount, currency)}</span>
                </div>
              )}
              {store.financials.taxRate > 0 && (
                <div className="flex justify-between py-2 text-sm text-slate-600">
                  <span>Tax ({store.financials.taxRate}%)</span>
                  <span>{formatCurrency(taxAmount, currency)}</span>
                </div>
              )}
              {store.financials.shipping > 0 && (
                <div className="flex justify-between py-2 text-sm text-slate-600">
                  <span>Shipping</span>
                  <span>{formatCurrency(store.financials.shipping, currency)}</span>
                </div>
              )}
              <div className="flex justify-between py-4 text-lg font-bold text-slate-900 border-t border-slate-200 mt-2">
                <span>Grand Total</span>
                <span>{formatCurrency(grandTotal, currency)}</span>
              </div>
              {store.financials.amountPaid > 0 && (
                <>
                  <div className="flex justify-between py-2 text-sm text-slate-600">
                    <span>Amount Paid</span>
                    <span>-{formatCurrency(store.financials.amountPaid, currency)}</span>
                  </div>
                  <div className="flex justify-between py-3 text-md font-bold text-indigo-600 bg-indigo-50 px-4 rounded-lg mt-2">
                    <span>Balance Due</span>
                    <span>{formatCurrency(balanceDue, currency)}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Footer Info (Payment, Notes) */}
          <div className="mt-16 grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Payment Info</p>
              <div className="text-slate-600 grid grid-cols-2 gap-x-2 gap-y-1">
                {store.paymentDetails.method && <><span className="font-medium text-slate-700">Method:</span><span>{store.paymentDetails.method}</span></>}
                {store.paymentDetails.bankName && <><span className="font-medium text-slate-700">Bank:</span><span>{store.paymentDetails.bankName}</span></>}
                {store.paymentDetails.accountName && <><span className="font-medium text-slate-700">Name:</span><span>{store.paymentDetails.accountName}</span></>}
                {store.paymentDetails.accountNumber && <><span className="font-medium text-slate-700">Account:</span><span>{store.paymentDetails.accountNumber}</span></>}
                {store.paymentDetails.iban && <><span className="font-medium text-slate-700">IBAN:</span><span>{store.paymentDetails.iban}</span></>}
                {store.paymentDetails.swift && <><span className="font-medium text-slate-700">SWIFT:</span><span>{store.paymentDetails.swift}</span></>}
              </div>
            </div>
            
            <div className="space-y-6">
              {store.notes && (
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Notes</p>
                  <p className="text-slate-600 whitespace-pre-wrap">{store.notes}</p>
                </div>
              )}
              {store.termsAndConditions && (
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Terms</p>
                  <p className="text-slate-500 text-xs whitespace-pre-wrap">{store.termsAndConditions}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
