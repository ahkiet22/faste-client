'use client';

import { useState } from 'react';
import { PhoneVerification } from '../partials/phone-verification';
import { PinSetup } from '../partials/pin-setup';
import { EkycVerification } from '../partials/ekyc-verification';
import { BankLinking } from '../partials/bank-linking';
import { RegistrationComplete } from '../partials/registration-complete';


export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [registrationData, setRegistrationData] = useState({
    phone: '',
    email: '',
    pin: '',
    personalInfo: {},
    bankAccount: {},
  });

  const updateData = (data: any) => {
    setRegistrationData((prev) => ({ ...prev, ...data }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${
                    step >= num
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {num}
                </div>
                {num < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-colors ${step > num ? 'bg-primary' : 'bg-muted'}`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>Verify</span>
            <span>PIN Setup</span>
            <span>eKYC</span>
            <span>Bank Link</span>
          </div>
        </div>

        {/* Step Content */}
        {step === 1 && (
          <PhoneVerification
            onNext={nextStep}
            updateData={updateData}
            data={registrationData}
          />
        )}
        {step === 2 && (
          <PinSetup
            onNext={nextStep}
            onBack={prevStep}
            updateData={updateData}
            data={registrationData}
          />
        )}
        {step === 3 && (
          <EkycVerification
            onNext={nextStep}
            onBack={prevStep}
            updateData={updateData}
            data={registrationData}
          />
        )}
        {step === 4 && (
          <BankLinking
            onNext={nextStep}
            onBack={prevStep}
            updateData={updateData}
            data={registrationData}
          />
        )}
        {step === 5 && <RegistrationComplete data={registrationData} />}
      </div>
    </div>
  );
}
