import React, { useState } from 'react';
import { X, CheckSquare, ShieldCheck, AlertCircle, Printer } from 'lucide-react';

const initialItems = [
  { id: 1, category: 'Room & Fixtures Inspection', text: 'Test all electrical switchboards, charging points, and study lamp sockets', checked: false },
  { id: 2, category: 'Room & Fixtures Inspection', text: 'Check AC cooling and verify remote control functioning', checked: false },
  { id: 3, category: 'Room & Fixtures Inspection', text: 'Inspect bathroom geyser, water pressure, flush, and tap leakages', checked: false },
  { id: 4, category: 'Room & Fixtures Inspection', text: 'Check condition of mattress, wardrobe locks, and study table drawers', checked: false },
  { id: 5, category: 'Keys & Access', text: 'Receive main entrance key or register biometric fingerprint with warden', checked: false },
  { id: 6, category: 'Keys & Access', text: 'Receive room key & personal wardrobe locker key', checked: false },
  { id: 7, category: 'Utility & Sub-Meter Verification', text: 'Take timestamped photo of initial electricity sub-meter reading', checked: false },
  { id: 8, category: 'Utility & Sub-Meter Verification', text: 'Obtain Wi-Fi network SSID and password from owner/warden', checked: false },
  { id: 9, category: 'Documentation & Security', text: 'Verify and digitally execute the Thapar Rental Agreement', checked: false },
  { id: 10, category: 'Documentation & Security', text: 'Obtain official written receipt for security deposit and first month rent', checked: false },
  { id: 11, category: 'Documentation & Security', text: 'Submit tenant verification form details to Patiala Police (if requested by owner)', checked: false },
  { id: 12, category: 'Emergency Contacts', text: 'Save owner, warden, and nearby Thapar Gate security numbers on phone', checked: false },
];

const MoveInChecklistModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [items, setItems] = useState(initialItems);

  const toggleItem = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item))
    );
  };

  const completedCount = items.filter((i) => i.checked).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">TIET Student Move-In & Handover Checklist</h3>
              <p className="text-xs text-slate-500">Ensure room condition, meter readings, keys, and receipts are documented</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1.5">
            <span>Checklist Completion Progress</span>
            <span className="text-emerald-600">{completedCount} of {items.length} items ({progressPercent}%)</span>
          </div>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Checklist items */}
        <div className="p-6 space-y-3">
          {items.map((item) => (
            <label
              key={item.id}
              onClick={() => toggleItem(item.id)}
              className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                item.checked
                  ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
              }`}
            >
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => {}} // handled by label click
                className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer"
              />
              <div className="text-xs leading-relaxed">
                <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-400 block mb-0.5">
                  {item.category}
                </span>
                <span className={item.checked ? 'line-through text-slate-500' : ''}>
                  {item.text}
                </span>
              </div>
            </label>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between bg-slate-50 text-xs">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Checklist</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MoveInChecklistModal;
