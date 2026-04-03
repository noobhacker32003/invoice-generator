"use client";

import React from "react";
import { useInvoiceStore } from "@/store/useInvoiceStore";
import { Plus, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { formatCurrency } from "@/lib/utils";

export function LineItemsEditor() {
  const { lineItems, addLineItem, removeLineItem, updateLineItem, invoiceMetadata } = useInvoiceStore();

  return (
    <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-slate-900">Line Items</h2>
        <button
          onClick={addLineItem}
          className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Item
        </button>
      </div>

      <div className="space-y-4">
        {lineItems.map((item, index) => (
          <div key={item.id} className="group relative flex flex-col md:flex-row gap-3 border border-slate-100 p-4 rounded-xl items-start md:items-center bg-slate-50/50 hover:bg-white transition-colors hover:border-slate-300">
            <div className="flex-1 w-full">
              <Input
                placeholder="Item description..."
                value={item.description}
                onChange={(e) => updateLineItem(item.id, { description: e.target.value })}
                className="bg-transparent border-slate-200"
              />
            </div>
            <div className="w-full md:w-24">
              <Input
                type="number"
                min="1"
                placeholder="Qty"
                value={item.quantity}
                onChange={(e) => updateLineItem(item.id, { quantity: parseFloat(e.target.value) || 0 })}
                className="bg-transparent border-slate-200"
              />
            </div>
            <div className="w-full md:w-32">
              <Input
                type="number"
                min="0"
                placeholder="Price"
                value={item.unitPrice}
                onChange={(e) => updateLineItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                className="bg-transparent border-slate-200"
              />
            </div>
            <div className="w-full md:w-32 flex items-center justify-between md:justify-end px-2">
              <span className="text-sm font-medium text-slate-900">
                {formatCurrency(item.amount, invoiceMetadata.currency)}
              </span>
              <button
                onClick={() => removeLineItem(item.id)}
                disabled={lineItems.length === 1}
                className="text-slate-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors p-2"
                title="Remove Item"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
