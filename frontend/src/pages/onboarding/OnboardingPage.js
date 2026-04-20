import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { UserIcon, DocumentIcon, CreditCardIcon, BanknotesIcon, CheckCircleIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    { id: 1, name: 'Basic Details', icon: UserIcon, description: 'Tell us about your business' },
    { id: 2, name: 'KYC Documents', icon: DocumentIcon, description: 'Verify your identity' },
    { id: 3, name: 'Payment Setup', icon: CreditCardIcon, description: 'Configure payments' },
    { id: 4, name: 'Bank Details', icon: BanknotesIcon, description: 'Add settlement account' },
  ];

  const handleNext = async () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    } else {
      toast.success('🎉 Onboarding completed!');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
    }
  };

  const StepIcon = ({ step, isActive, isCompleted }) => {
    const Icon = step.icon;
    return (
      <div
        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all ${
          isCompleted
            ? 'bg-emerald-500 text-white'
            : isActive
            ? 'bg-primary-600 text-white shadow-lg scale-110'
            : 'bg-slate-200 text-slate-600'
        }`}
      >
        {isCompleted ? <CheckCircleIcon className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4 relative overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome to WhatsApp Bot!</h1>
          <p className="text-slate-400">Complete these 4 steps to activate your merchant account</p>
        </div>

        {/* Progress Indicator */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-2 mb-12">
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <div key={step.id} className="flex items-center flex-1">
                {/* Step Circle */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <StepIcon step={step} isActive={step.id === currentStep} isCompleted={step.id < currentStep} />
                  <p className="text-xs font-medium text-slate-300 mt-2 text-center max-w-[80px]">{step.name}</p>
                </div>

                {/* Connector Line */}
                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all rounded-full ${
                      step.id < currentStep ? 'bg-emerald-500' : 'bg-slate-600'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl">
          {/* Step Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">
              {steps[currentStep - 1].name}
            </h2>
            <p className="text-slate-400">{steps[currentStep - 1].description}</p>
          </div>

          {/* Step 1: Basic Details */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Business Name</label>
                <input
                  type="text"
                  placeholder="Enter your business name"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Business Email</label>
                <input
                  type="email"
                  placeholder="Enter your business email"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Business Description</label>
                <textarea
                  placeholder="Tell us about your business..."
                  rows="4"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 2: KYC Documents */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-4">Upload GST Certificate</label>
                <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer group">
                  <DocumentIcon className="w-12 h-12 text-slate-300 mx-auto mb-3 group-hover:text-primary-400 transition-colors" />
                  <p className="text-slate-300 font-medium mb-1">Drag and drop your GST certificate</p>
                  <p className="text-slate-500 text-sm">or click to browse</p>
                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-4">Upload Business License</label>
                <div className="border-2 border-dashed border-white/30 rounded-lg p-8 text-center hover:border-primary-400 transition-colors cursor-pointer group">
                  <DocumentIcon className="w-12 h-12 text-slate-300 mx-auto mb-3 group-hover:text-primary-400 transition-colors" />
                  <p className="text-slate-300 font-medium mb-1">Drag and drop your business license</p>
                  <p className="text-slate-500 text-sm">or click to browse</p>\n                  <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Payment Setup */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Razorpay Account ID</label>
                <input
                  type="text"
                  placeholder="Enter your Razorpay Account ID"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Razorpay API Key</label>
                <input
                  type="password"
                  placeholder="Enter your Razorpay API Key"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
              <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <p className="text-sm text-blue-200">
                  💡 <span className="font-semibold">Tip:</span> You can find your keys in Razorpay Settings → API Keys
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Bank Details */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Account Holder Name</label>
                <input
                  type="text"
                  placeholder="Enter account holder name"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">Account Number</label>
                <input
                  type="text"
                  placeholder="Enter your account number"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2">IFSC Code</label>
                <input
                  type="text"
                  placeholder="Enter IFSC code"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                />
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-12 pt-8 border-t border-white/10">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white font-semibold hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-semibold rounded-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 shadow-lg"
            >
              {currentStep === steps.length ? (
                <>
                  <CheckCircleIcon className="w-5 h-5" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  Next
                  <ArrowRightIcon className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-400 text-sm">
          <p>Step {currentStep} of {steps.length}</p>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;
