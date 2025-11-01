import React from "react";

export default function PaymentsEarnings() {
  const payments = [
    { id: 1, date: "2024-10-25", amount: 150, description: "Web Development" },
    { id: 2, date: "2024-10-18", amount: 200, description: "App UI Design" },
    { id: 3, date: "2024-10-05", amount: 175, description: "Content Writing" },
  ];

  const total = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Payments & Earnings</h2>
      <p className="text-gray-600 mb-4">Total Earnings: ${total}</p>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {payments.map((p) => (
          <div key={p.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
            <div className="flex justify-between mb-2">
              <div>
                <p className="font-semibold text-gray-800">{p.description}</p>
                <p className="text-sm text-gray-500">{p.date}</p>
              </div>
             
            </div>
            <p className="text-xl font-bold text-green-600">${p.amount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
