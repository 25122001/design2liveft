import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";

function UserModel({
  isOpen,
  onClose,
  formData,
  setFormData,
  onSubmit,
  loading,
  editingItem,
}) {
  const [step, setStep] = useState(1);

  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) setStep(1);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleNext = () => {
    if (!formData.name || !formData.email) {
      alert("Please fill required fields");
      return;
    }
    setStep(2);
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto border border-gray-800">
        {/* HEADER */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold text-white">
            {editingItem ? (
              <>
                Edit Tenant :{" "}
                <span className="text-green-500">{editingItem.name}</span>
              </>
            ) : (
              "Add New Tenant"
            )}
          </h2>

          <button className="text-gray-400 hover:text-white" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="border-b border-gray-800 pb-6">
          {/* Centered Tenant Object ID */}
          <div className="flex justify-center mb-4">
            <h2 className="text-xl font-medium text-gray-400">
              Tenant Object ID :
              <span className="ml-2 text-blue-500 font-mono bg-gray-900 px-3 py-1 rounded-md">
                {editingItem?._id || "Not Available"}
              </span>
            </h2>
          </div>

          {/* Grey Separator Line */}
          <div className="border-b border-gray-700"></div>

          {/* Steps Section */}
          <div className="flex items-center justify-center gap-8 mt-6">
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition ${
                  step === 1
                    ? "bg-green-500 text-black"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                1
              </div>
              <span
                className={`text-sm font-medium ${
                  step === 1 ? "text-white" : "text-gray-400"
                }`}
              >
                Basic Details
              </span>
            </div>

            <div className="w-16 h-[1px] bg-gray-700"></div>

            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition ${
                  step === 2
                    ? "bg-green-500 text-black"
                    : "bg-gray-800 text-gray-400"
                }`}
              >
                2
              </div>
              <span
                className={`text-sm font-medium ${
                  step === 2 ? "text-white" : "text-gray-400"
                }`}
              >
                Additional Details
              </span>
            </div>
          </div>
        </div>
        {/* FORM */}
        <form onSubmit={handleFormSubmit} className="p-6">
          {/* ================= STEP 1 ================= */}
          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NAME */}
              <InputField
                label="Name*"
                value={formData.name}
                onChange={(val) =>
                  setFormData({ ...formData, name: val.trimStart() })
                }
              />

              {/* EMAIL */}
              <InputField
                label="Email*"
                type="email"
                value={formData.email}
                onChange={(val) =>
                  setFormData({ ...formData, email: val.trim() })
                }
              />

              {/* PHONE */}
              <InputField
                label="Phone Number*"
                value={formData.phone}
                maxLength={10}
                onChange={(val) =>
                  setFormData({
                    ...formData,
                    phone: val.replace(/\D/g, ""),
                  })
                }
              />

              {/* AADHAR */}
              <InputField
                label="Aadhar Number*"
                value={formData.aadhar}
                maxLength={12}
                onChange={(val) =>
                  setFormData({
                    ...formData,
                    aadhar: val.replace(/\D/g, ""),
                  })
                }
              />
              <InputField
                label="portion*"
                value={formData.portion}
                onChange={(val) =>
                  setFormData({ ...formData, portion: val.trimStart() })
                }
              />

              {/* STATUS */}
              <div>
                <label className="block text-gray-300 font-medium mb-2">
                  Status*
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <div className="md:col-span-2 flex justify-end mt-4">
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-6 py-2 bg-green-500 text-black rounded-lg hover:bg-green-400 transition"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 2 ================= */}
          {step === 2 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField
                label="working*"
                value={formData.working}
                onChange={(val) =>
                  setFormData({ ...formData, working: val.trimStart() })
                }
              />

              <div className="md:col-span-2 flex justify-between mt-6">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-6 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700"
                >
                  ← Back
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-2 bg-green-500 text-black rounded-lg hover:bg-green-400"
                >
                  <Check size={20} />
                  {loading
                    ? "Saving..."
                    : editingItem
                      ? "Update Tenant"
                      : "Add Tenant"}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

/* Reusable Input */
function InputField({ label, value, onChange, type = "text", maxLength }) {
  return (
    <div>
      <label className="block text-gray-300 font-medium mb-2">{label}</label>
      <input
        type={type}
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
      />
    </div>
  );
}

export default UserModel;
