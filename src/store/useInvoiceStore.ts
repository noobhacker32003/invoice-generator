import { create } from 'zustand';
import { format } from 'date-fns';

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
};

export type InvoiceState = {
  invoiceMetadata: {
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    currency: string;
  };
  senderDetails: {
    companyName: string;
    website: string;
    email: string;
    phone: string;
    address: string;
    logoBase64: string;
  };
  clientDetails: {
    clientName: string;
    clientEmail: string;
    companyName: string;
    phone: string;
    address: string;
  };
  lineItems: LineItem[];
  financials: {
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    taxRate: number;
    shipping: number;
    amountPaid: number;
  };
  paymentDetails: {
    method: string;
    bankName: string;
    accountName: string;
    accountNumber: string;
    iban: string;
    swift: string;
  };
  notes: string;
  termsAndConditions: string;
};

export type InvoiceStore = InvoiceState & {
  // Actions
  updateMetadata: (data: Partial<InvoiceState['invoiceMetadata']>) => void;
  updateSender: (data: Partial<InvoiceState['senderDetails']>) => void;
  updateClient: (data: Partial<InvoiceState['clientDetails']>) => void;
  addLineItem: () => void;
  removeLineItem: (id: string) => void;
  updateLineItem: (id: string, data: Partial<LineItem>) => void;
  updateFinancials: (data: Partial<InvoiceState['financials']>) => void;
  updatePayment: (data: Partial<InvoiceState['paymentDetails']>) => void;
  updateNotes: (notes: string) => void;
  updateTerms: (terms: string) => void;
  
  // Computed (getters)
  getSubTotal: () => number;
  getDiscountAmount: () => number;
  getTaxAmount: () => number;
  getGrandTotal: () => number;
  getBalanceDue: () => number;
};

const generateId = () => Math.random().toString(36).substring(2, 9);

const initialState: InvoiceState = {
  invoiceMetadata: {
    invoiceNumber: 'INV-' + format(new Date(), 'yyyyMM') + '-001',
    issueDate: format(new Date(), 'yyyy-MM-dd'),
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    currency: 'USD',
  },
  senderDetails: {
    companyName: 'Itversee',
    website: 'https://itversee.com',
    email: 'contact@itversee.com',
    phone: '+1 234 567 8900',
    address: '123 Tech Lane, Silicon Valley, CA 94025',
    logoBase64: '/logo.jpeg',
  },
  clientDetails: {
    clientName: '',
    clientEmail: '',
    companyName: '',
    phone: '',
    address: '',
  },
  lineItems: [
    { id: generateId(), description: 'Web Development Services', quantity: 1, unitPrice: 0, amount: 0 }
  ],
  financials: {
    discountType: 'percentage',
    discountValue: 0,
    taxRate: 0,
    shipping: 0,
    amountPaid: 0,
  },
  paymentDetails: {
    method: 'Bank Transfer',
    bankName: '',
    accountName: '',
    accountNumber: '',
    iban: '',
    swift: '',
  },
  notes: 'Thank you for your business!',
  termsAndConditions: 'Please pay within 15 days of receiving this invoice.',
};

export const useInvoiceStore = create<InvoiceStore>((set, get) => ({
  ...initialState,

  updateMetadata: (data) => set((state) => ({ invoiceMetadata: { ...state.invoiceMetadata, ...data } })),
  updateSender: (data) => set((state) => ({ senderDetails: { ...state.senderDetails, ...data } })),
  updateClient: (data) => set((state) => ({ clientDetails: { ...state.clientDetails, ...data } })),
  
  addLineItem: () => set((state) => ({
    lineItems: [
      ...state.lineItems,
      { id: generateId(), description: '', quantity: 1, unitPrice: 0, amount: 0 }
    ]
  })),
  
  removeLineItem: (id) => set((state) => ({
    lineItems: state.lineItems.filter((item) => item.id !== id)
  })),
  
  updateLineItem: (id, data) => set((state) => ({
    lineItems: state.lineItems.map((item) => {
      if (item.id === id) {
        const updated = { ...item, ...data };
        // Auto-calculate amount
        updated.amount = updated.quantity * updated.unitPrice;
        return updated;
      }
      return item;
    })
  })),

  updateFinancials: (data) => set((state) => ({ financials: { ...state.financials, ...data } })),
  updatePayment: (data) => set((state) => ({ paymentDetails: { ...state.paymentDetails, ...data } })),
  updateNotes: (notes) => set({ notes }),
  updateTerms: (terms) => set({ termsAndConditions: terms }),

  // Computed Values
  getSubTotal: () => {
    const { lineItems } = get();
    return lineItems.reduce((acc, item) => acc + item.amount, 0);
  },
  getDiscountAmount: () => {
    const { financials } = get();
    const subTotal = get().getSubTotal();
    if (financials.discountType === 'percentage') {
      return subTotal * (financials.discountValue / 100);
    }
    return financials.discountValue;
  },
  getTaxAmount: () => {
    const { financials } = get();
    const taxableAmount = get().getSubTotal() - get().getDiscountAmount();
    return taxableAmount * (financials.taxRate / 100);
  },
  getGrandTotal: () => {
    const { financials } = get();
    const subTotal = get().getSubTotal();
    const discount = get().getDiscountAmount();
    const tax = get().getTaxAmount();
    return subTotal - discount + tax + financials.shipping;
  },
  getBalanceDue: () => {
    const parent = get();
    const { financials } = parent;
    return parent.getGrandTotal() - financials.amountPaid;
  }
}));
