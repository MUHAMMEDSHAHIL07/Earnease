import React from 'react';

const VerificationPending = () => {
  return (
    <div className="min-h-screen flex justify-center items-center bg-yellow-50">
      <div className="bg-white p-6 rounded-xl shadow-md text-center max-w-md">
        <h2 className="text-2xl font-semibold mb-2 text-yellow-700">You're Under Verification</h2>
        <p className="text-gray-600">
          Your account is currently under admin review. You'll be notified via email once your company is approved.
        </p>
      </div>
    </div>
  );
};

export default VerificationPending;
