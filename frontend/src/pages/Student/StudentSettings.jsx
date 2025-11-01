import React, { useState } from "react";
import { Settings, Check } from "lucide-react";
import Navbar from "../../components/Navbar";
import ChangePassword from "../../components/ChangePassword"
import PaymentsEarnings from "../../components/PaymentsEarnings"
import HelpCenter from "../../components/HelpCenter"
import NotificationSettings from "../../components/NotificationsSettings"

export default function UserSettings() {
  const [activeTab, setActiveTab] = useState("password");

  const payments = [
    { id: 1, date: "2024-10-25", amount: 150, description: "Project: Web Development" },
    { id: 2, date: "2024-10-18", amount: 200, description: "Project: Mobile App UI" },
    { id: 3, date: "2024-10-10", amount: 125, description: "Project: Logo Design" },
    { id: 4, date: "2024-10-05", amount: 175, description: "Project: Content Writing" },
  ];

  const totalEarnings = payments.reduce((sum, p) => sum + p.amount, 0);

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 bg-white rounded-xl shadow-lg p-4 h-fit">
            <div className="flex items-center gap-2 mb-6">
              <Settings className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold text-gray-800">Settings</h2>
            </div>

            <div className="space-y-2">
              {[
                { id: "password", label: "Change Password", color: "blue" },
                { id: "payments", label: "Payments / Earnings", color: "green" },
                { id: "help", label: "Help Center", color: "purple" },
                { id: "notifications", label: "Notification Settings", color: "orange" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                    activeTab === tab.id
                      ? `bg-${tab.color}-600 text-white shadow`
                      : `hover:bg-${tab.color}-50 text-gray-700`
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 bg-white rounded-xl shadow-lg p-8 transition-all">


            {activeTab === "password" && <ChangePassword />}
            {activeTab === "payments" && <PaymentsEarnings payments={payments} totalEarnings={totalEarnings} />}
            {activeTab === "help" && <HelpCenter  />}
            {activeTab === "notifications" && <NotificationSettings />}
          </div>
        </div>
      </div>
    </>
  )
}