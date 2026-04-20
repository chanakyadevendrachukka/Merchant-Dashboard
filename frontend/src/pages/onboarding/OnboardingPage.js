import React, { useState } from 'react';
import toast from 'react-hot-toast';

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, name: 'Basic Details', icon: '📝' },
    { id: 2, name: 'KYC Documents', icon: '📄' },
    { id: 3, name: 'Payment Setup', icon: '💳' },
    { id: 4, name: 'Bank Details', icon: '🏦' },
  ];

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.success('Onboarding completed!');
      // Redirect to dashboard
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Progress Bar */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex justify-between mb-8">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 font-bold ${
                    step.id <= currentStep
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {step.id}
                </div>
                <p className="text-sm font-medium text-center">{step.name}</p>
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 mt-2 ${
                      step.id < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div className="bg-gray-50 rounded-lg p-8 mb-8">
            {currentStep === 1 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Basic Business Details</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Business Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <input
                    type="email"
                    placeholder="Business Email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <textarea
                    placeholder="Business Description"
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">KYC Documents</h2>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-600 mb-2">📄 Upload GST Certificate</p>
                    <input type="file" className="w-full" />
                  </div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <p className="text-gray-600 mb-2">🪪 Upload Business License</p>
                    <input type="file" className="w-full" />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Payment Configuration</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Razorpay Account ID"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <input
                    type="text"
                    placeholder="Razorpay API Key"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Bank Account Details</h2>
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Account Holder Name"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <input
                    type="text"
                    placeholder="Account Number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <input
                    type="text"
                    placeholder="IFSC Code"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 font-semibold disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg"
            >
              {currentStep === steps.length ? 'Complete' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
