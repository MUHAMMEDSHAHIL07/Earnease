import React, { useState } from "react";
import { Upload, X } from "lucide-react";

export default function HelpCenter({ setSuccessMessage }) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const handleFileUpload = (e) => setFile(e.target.files[0]);
  const removeFile = () => setFile(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage("Help request submitted successfully!");
    setMessage("");
    setFile(null);
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-6">Help Center</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your issue
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
            rows="5"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Attach file (optional)
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-500 transition">
            {!file ? (
              <label className="cursor-pointer">
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                <input type="file" onChange={handleFileUpload} className="hidden" accept=".png,.jpg,.jpeg,.pdf" />
              </label>
            ) : (
              <div className="flex items-center justify-between bg-purple-50 p-3 rounded">
                <span className="text-sm text-gray-700 truncate">{file.name}</span>
                <button type="button" onClick={removeFile} className="text-red-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold transition"
        >
          Submit Request
        </button>
      </form>
    </div>
  )
}