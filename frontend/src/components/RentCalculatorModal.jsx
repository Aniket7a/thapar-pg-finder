import React, { useState } from 'react';
import { X, Calculator, IndianRupee, Info, CheckCircle2 } from 'lucide-react';

const RentCalculatorModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [monthlyRent, setMonthlyRent] = useState(8000);
  const [depositMonths, setDepositMonths] = useState(1);
  const [foodCost, setFoodCost] = useState(0); // 0 if food included in PG
  const [foodIncluded, setFoodIncluded] = useState(true);
  const [electricityEstimated, setElectricityEstimated] = useState(500);
  const [laundryWifiMisc, setLaundryWifiMisc] = useState(300);
  const [movingTransportExpense, setMovingTransportExpense] = useState(1500);
  const [roomEssentials, setRoomEssentials] = useState(2000); // mattress, bucket, extension cord, study lamp

  // Calculations
  const calculatedDeposit = monthlyRent * depositMonths;
  const actualFood = foodIncluded ? 0 : foodCost;
  const recurringMonthlyCost = monthlyRent + actualFood + electricityEstimated + laundryWifiMisc;
  const initialMoveInTotal = calculatedDeposit + monthlyRent + movingTransportExpense + roomEssentials;
  const semesterBudget = recurringMonthlyCost * 5 + calculatedDeposit; // 5 months semester

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-100 text-red-600 flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Thapar Student Rent & Move-In Calculator</h3>
              <p className="text-xs text-slate-500">Accurately project your living costs and initial move-in deposit</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Inputs Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Monthly Rent (Per Student/Bed)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400">₹</span>
                <input
                  type="number"
                  value={monthlyRent}
                  onChange={(e) => setMonthlyRent(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Security Deposit Required
              </label>
              <select
                value={depositMonths}
                onChange={(e) => setDepositMonths(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              >
                <option value={1}>1 Month Rent (₹{monthlyRent * 1})</option>
                <option value={2}>2 Months Rent (₹{monthlyRent * 2})</option>
                <option value={0}>Zero Deposit</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Meals / Mess Status
              </label>
              <div className="flex items-center gap-4 text-xs mt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="foodStatus"
                    checked={foodIncluded}
                    onChange={() => setFoodIncluded(true)}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span>Food Included in Rent</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="foodStatus"
                    checked={!foodIncluded}
                    onChange={() => setFoodIncluded(false)}
                    className="text-red-600 focus:ring-red-500"
                  />
                  <span>Separate Tiffin / Mess</span>
                </label>
              </div>
              {!foodIncluded && (
                <div className="relative mt-2">
                  <span className="absolute left-3 top-2 text-xs text-slate-400">₹</span>
                  <input
                    type="number"
                    placeholder="Monthly tiffin fee"
                    value={foodCost || ''}
                    onChange={(e) => setFoodCost(Number(e.target.value))}
                    className="w-full pl-7 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Estimated Electricity & AC Bill (Monthly)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400">₹</span>
                <input
                  type="number"
                  value={electricityEstimated}
                  onChange={(e) => setElectricityEstimated(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Initial Moving / Auto / Transport
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400">₹</span>
                <input
                  type="number"
                  value={movingTransportExpense}
                  onChange={(e) => setMovingTransportExpense(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Room Setup Essentials (Bedding, Bucket, Lamp)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400">₹</span>
                <input
                  type="number"
                  value={roomEssentials}
                  onChange={(e) => setRoomEssentials(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-inner">
            <div className="text-xs uppercase font-bold tracking-wider text-red-400 mb-3">
              Cost Projection Summary
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-700/80 pt-1">
              <div className="sm:pr-4">
                <div className="text-xs text-slate-400">Monthly Recurring Cost</div>
                <div className="text-2xl font-extrabold text-white mt-1">
                  ₹{recurringMonthlyCost.toLocaleString('en-IN')}
                  <span className="text-xs font-normal text-slate-400">/mo</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Rent + Utilities + Food + Wi-Fi
                </div>
              </div>

              <div className="sm:px-4 pt-3 sm:pt-0">
                <div className="text-xs text-amber-400 font-semibold">Total Move-In Cash Required</div>
                <div className="text-2xl font-extrabold text-amber-300 mt-1">
                  ₹{initialMoveInTotal.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  1st Month + Deposit + Setup Kit
                </div>
              </div>

              <div className="sm:pl-4 pt-3 sm:pt-0">
                <div className="text-xs text-slate-400">Estimated Semester (5 Mo)</div>
                <div className="text-2xl font-extrabold text-white mt-1">
                  ₹{semesterBudget.toLocaleString('en-IN')}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Full academic session budget
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-100 flex justify-end bg-slate-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default RentCalculatorModal;
