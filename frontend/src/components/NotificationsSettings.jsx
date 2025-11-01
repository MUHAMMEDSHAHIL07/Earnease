import { Bell } from "lucide-react";

export default function NotificationsSettings() {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <Bell className="w-16 h-16 text-orange-400 mb-4" />
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon</h3>
      <p className="text-gray-600 text-center max-w-md">
        We're working on customizable notification preferences. Stay tuned!
      </p>
      <div className="mt-6 px-5 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
        In Development
      </div>
    </div>
  );
}