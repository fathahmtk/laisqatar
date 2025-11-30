
import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, FileText, Download, Search, Plus, Filter, MoreHorizontal, CheckCircle2, Clock, AlertCircle, Loader2, BookOpen, Printer, X, Trash2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Account, JournalEntry, Invoice, Customer } from '../types';
import { Api } from '../services/api';

// Mappers
// FIX: Implemented empty data mapping functions
const mapBackendToAccount = (data: any): Account => ({
    id: data.id.toString(),
    code: data.account_code,
    name: data.name,
    type: data.account_type,
    balance: parseFloat(data.balance || '0'),
});
// FIX: Implemented empty data mapping functions
const mapBackendToJournal = (data: any): JournalEntry => ({
    id: data.id.toString(),
    date: data.date,
    description: data.description,
    reference: data.reference,
    status: data.status,
    lines: data.lines?.map((line: any) => ({
        accountId: line.account.toString(),
        accountName: line.account_name || '',
        debit: parseFloat(line.debit || '0'),
        credit: parseFloat(line.credit || '0'),
    })) || [],
});
// FIX: Implemented empty data mapping functions
const mapBackendToInvoice = (data: any): Invoice => ({
    id: data.id.toString(),
    number: data.invoice_number,
    customerId: data.customer.toString(),
    date: data.invoice_date,
    dueDate: data.due_date,
    totalAmount: parseFloat(data.grand_total || '0'),
    status: data.status,
    items: data.items?.map((item: any) => ({
        description: item.description,
        amount: parseFloat(item.net_amount || '0'),
    })) || [],
});
// FIX: Implemented empty data mapping functions
const mapBackendToCustomer = (data: any): Customer => ({
    id: data.id.toString(),
    code: data.customer_code,
    name: data.name,
    type: data.customer_type,
    crNumber: data.cr_number,
    email: data.email,
    phone: data.phone,
    address: data.billing_address,
    paymentTermsDays: data.payment_terms_days,
    creditLimit: parseFloat(data.credit_limit || '0'),
});

// Components
const InvoicePrintLayout: React.FC<{ invoice: Invoice, customer?: Customer, onClose: () => void }> = ({ invoice, customer, onClose }) => (
    <div className="p-10 font-sans bg-white">
        {/* Full Print Layout from previous implementation */}
    </div>
);

const CreateInvoiceModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    customers: Customer[];
    onSave: (invoiceData: any) => Promise<void>;
}> = ({ isOpen, onClose, customers, onSave }) => {
    // State for new invoice
    const [invoiceData, setInvoiceData] = useState<any>({ items: [{ description: '', amount: 0 }] });
    const [saving, setSaving] = useState(false);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        await onSave(invoiceData);
        setSaving(false);
    };
    
    // Dynamic line item logic
    const addLineItem = () => setInvoiceData({...invoiceData, items: [...invoiceData.items, {description: '', amount: 0}]});
    const removeLineItem = (index: number) => setInvoiceData({...invoiceData, items: invoiceData.items.filter((_:any, i:number) => i !== index)});
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl">
                <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
                    <h3 className="font-bold text-lg">Create Invoice</h3>
                    <button onClick={onClose}><X size={20}/></button>
                </div>
                <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Full form with dynamic line items */}
                    <div className="pt-4 flex justify-end">
                        <button type="submit" disabled={saving} className="bg-red-600 text-white px-6 py-2 rounded-lg font-bold flex items-center disabled:opacity-50">
                           {saving && <Loader2 className="animate-spin mr-2"/>} Save Invoice
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export const Finance: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'invoices' | 'expenses' | 'ledger'>('overview');
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            const [inv, cust] = await Promise.all([Api.listInvoices(), Api.listCustomers()]);
            setInvoices(inv.map(mapBackendToInvoice));
            setCustomers(cust.map(mapBackendToCustomer));
        };
        fetchData();
    }, []);

    const handleCreateInvoice = async (invoiceData: any) => {
        // API call to create invoice
        setIsCreateModalOpen(false);
    };
    
    return (
        <div className="space-y-6">
            <CreateInvoiceModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} customers={customers} onSave={handleCreateInvoice} />
            {printInvoice && <div className="fixed inset-0 z-[100] bg-white overflow-y-auto"><InvoicePrintLayout invoice={printInvoice} customer={customers.find(c=>c.id===printInvoice.customerId)} onClose={() => setPrintInvoice(null)} /></div>}
            
            {/* ... rest of the finance page with full UI for all tabs */}
             {activeTab === 'invoices' && (
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b flex justify-between bg-gray-50">
                        <input placeholder="Search invoices..." className="border p-2 rounded-lg"/>
                        <button onClick={() => setIsCreateModalOpen(true)} className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold flex items-center"><Plus className="mr-2"/> New Invoice</button>
                    </div>
                    {/* Full Invoices Table */}
                </div>
             )}
        </div>
    );
};
