import React, { useState } from 'react';
import { Budget, Patient, BudgetItem } from '../types';
import { DollarSign, FileSpreadsheet, Plus, Printer, Trash2, CheckCircle2, AlertCircle, Calculator } from 'lucide-react';

interface BudgetsProps {
  budgets: Budget[];
  patients: Patient[];
  onAddBudget: (newBudget: Budget) => void;
  onUpdatePayment: (budgetId: string, addedPayment: number) => void;
}

export const Budgets: React.FC<BudgetsProps> = ({
  budgets,
  patients,
  onAddBudget,
  onUpdatePayment
}) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || '');
  
  // Budget Items Form State
  const [items, setItems] = useState<BudgetItem[]>([
    { id: 'i-1', description: 'Consulta y Diagnóstico Odontológico', cost: 15000 }
  ]);
  const [newToothNum, setNewToothNum] = useState<string>('');
  const [newDesc, setNewDesc] = useState<string>('');
  const [newCost, setNewCost] = useState<number>(30000);

  // Payment Registrar State
  const [paymentAmountModal, setPaymentAmountModal] = useState<{ budgetId: string; amount: number } | null>(null);

  const handleAddItem = () => {
    if (!newDesc) return;
    const newItem: BudgetItem = {
      id: 'item-' + Date.now(),
      toothNumber: newToothNum ? Number(newToothNum) : undefined,
      description: newDesc,
      cost: Number(newCost)
    };
    setItems([...items, newItem]);
    setNewDesc('');
    setNewToothNum('');
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter(i => i.id !== itemId));
  };

  const totalCostCalculated = items.reduce((acc, curr) => acc + curr.cost, 0);

  const handleCreateBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const patientObj = patients.find(p => p.id === selectedPatientId);
    if (!patientObj || items.length === 0) return;

    const newBudget: Budget = {
      id: 'bud-' + Date.now(),
      patientId: patientObj.id,
      patientName: patientObj.name,
      date: new Date().toISOString().split('T')[0],
      items,
      totalCost: totalCostCalculated,
      paidAmount: 0,
      status: 'aprobado'
    };

    onAddBudget(newBudget);
    setShowModal(false);
  };

  const handleAddPaymentSubmit = () => {
    if (!paymentAmountModal || paymentAmountModal.amount <= 0) return;
    onUpdatePayment(paymentAmountModal.budgetId, paymentAmountModal.amount);
    setPaymentAmountModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-teal-600" />
            Presupuestos Odontológicos & Planes de Tratamiento
          </h2>
          <p className="text-sm text-slate-500">Valorización de prestaciones, registro de abonos parciales y liquidación de saldos.</p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 text-sm"
        >
          <Plus className="w-5 h-5" />
          Crear Nuevo Presupuesto
        </button>
      </div>

      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {budgets.map((b) => {
          const balanceRemaining = b.totalCost - b.paidAmount;
          const isFullyPaid = balanceRemaining <= 0;

          return (
            <div key={b.id} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">{b.patientName}</h3>
                    <p className="text-xs text-slate-400">Presupuesto #{b.id} • Fecha: {b.date}</p>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                    isFullyPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isFullyPaid ? 'Saldado / Pagado' : 'Saldo Pendiente'}
                  </span>
                </div>

                {/* Items Table */}
                <div className="space-y-2 mb-4">
                  <h4 className="text-xs font-bold uppercase text-slate-400">Prestaciones Odontológicas:</h4>
                  <div className="divide-y divide-slate-100 text-xs">
                    {b.items.map(item => (
                      <div key={item.id} className="py-2 flex items-center justify-between">
                        <div>
                          {item.toothNumber && (
                            <span className="font-bold text-teal-700 bg-teal-50 px-1.5 py-0.5 rounded mr-2">
                              Diente #{item.toothNumber}
                            </span>
                          )}
                          <span className="text-slate-700">{item.description}</span>
                        </div>
                        <span className="font-semibold text-slate-900">${item.cost.toLocaleString('es-AR')}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Total & Balances Footer */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 font-medium">Costo Total Tratamiento:</span>
                  <span className="font-extrabold text-slate-900 text-base">${b.totalCost.toLocaleString('es-AR')}</span>
                </div>

                <div className="flex justify-between text-xs text-slate-500">
                  <span>Monto Abonado a la Fecha:</span>
                  <span className="font-bold text-emerald-600">${b.paidAmount.toLocaleString('es-AR')}</span>
                </div>

                <div className="flex justify-between text-sm pt-2 border-t border-slate-200">
                  <span className="font-bold text-slate-800">Saldo Restante a Cobrar:</span>
                  <span className={`font-black text-base ${balanceRemaining > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                    ${balanceRemaining.toLocaleString('es-AR')}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-3 gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-3 py-1.5 text-xs font-bold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 transition flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Imprimir Comprobante
                  </button>

                  {!isFullyPaid && (
                    <button
                      onClick={() => setPaymentAmountModal({ budgetId: b.id, amount: balanceRemaining })}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition flex items-center gap-1.5 shadow"
                    >
                      <DollarSign className="w-3.5 h-3.5" />
                      Registrar Pago
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal Crear Presupuesto */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-teal-600 px-6 py-4 text-white flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Calculator className="w-5 h-5" /> Nuevo Presupuesto Odontológico
              </h3>
              <button onClick={() => setShowModal(false)} className="text-teal-100 hover:text-white font-bold text-xl">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBudget} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div>
                <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Paciente:</label>
                <select
                  value={selectedPatientId}
                  onChange={(e) => setSelectedPatientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-teal-500 focus:outline-none"
                  required
                >
                  {patients.map(p => (
                    <option key={p.id} value={p.id}>{p.name} - DNI: {p.dni}</option>
                  ))}
                </select>
              </div>

              {/* Add Item Row */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase text-slate-600">Agregar Prestación:</h4>
                <div className="grid grid-cols-12 gap-2">
                  <input
                    type="number"
                    placeholder="Diente #"
                    value={newToothNum}
                    onChange={(e) => setNewToothNum(e.target.value)}
                    className="col-span-3 px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="text"
                    placeholder="Descripción (ej. Obturación composite)"
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    className="col-span-6 px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                  <input
                    type="number"
                    placeholder="Monto $"
                    value={newCost}
                    onChange={(e) => setNewCost(Number(e.target.value))}
                    className="col-span-3 px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="w-full py-2 bg-teal-600 text-white rounded-lg text-xs font-bold hover:bg-teal-700 transition"
                >
                  + Añadir Prestación al Desglose
                </button>
              </div>

              {/* Items List added */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-slate-500">Desglose de Tratamiento ({items.length}):</h4>
                <div className="border border-slate-200 rounded-xl divide-y divide-slate-100 text-xs">
                  {items.map(item => (
                    <div key={item.id} className="p-3 flex items-center justify-between">
                      <div>
                        {item.toothNumber && <span className="font-bold text-teal-600 mr-2">Diente #{item.toothNumber}</span>}
                        <span>{item.description}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold">${item.cost.toLocaleString('es-AR')}</span>
                        <button type="button" onClick={() => handleRemoveItem(item.id)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-teal-50 p-4 rounded-xl flex justify-between items-center text-teal-900">
                <span className="font-bold text-sm">TOTAL PRESUPUESTO:</span>
                <span className="font-black text-xl">${totalCostCalculated.toLocaleString('es-AR')}</span>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow-md transition"
                >
                  Confirmar y Guardar Presupuesto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Registrar Pago */}
      {paymentAmountModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-sm p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-teal-600" /> Registrar Abono de Paciente
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Monto a Ingresar ($ ARS):</label>
              <input
                type="number"
                value={paymentAmountModal.amount}
                onChange={(e) => setPaymentAmountModal({ ...paymentAmountModal, amount: Number(e.target.value) })}
                className="w-full px-3 py-2 text-base font-bold rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setPaymentAmountModal(null)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancelar
              </button>
              <button
                onClick={handleAddPaymentSubmit}
                className="px-4 py-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-700 rounded-xl shadow"
              >
                Guardar Pago
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
