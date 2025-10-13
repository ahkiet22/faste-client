/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface EkycVerificationProps {
  onNext: () => void;
  onBack: () => void;
  updateData: (data: any) => void;
  data: any;
}

export function EkycVerification({
  onNext,
  onBack,
  updateData,
}: EkycVerificationProps) {
  const [step, setStep] = useState<'info' | 'document' | 'selfie'>('info');
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    dateOfBirth: '',
    idType: '',
    idNumber: '',
    address: '',
  });
  const [documentFile, setDocumentFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);

  const handleInfoSubmit = () => {
    setStep('document');
  };

  const handleDocumentSubmit = () => {
    setStep('selfie');
  };

  const handleSelfieSubmit = () => {
    updateData({ personalInfo, documentFile, selfieFile });
    onNext();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Identity Verification (eKYC)</CardTitle>
        <CardDescription>
          Complete your identity verification to unlock all features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sub-steps indicator */}
        <div className="flex items-center gap-2 text-sm">
          <div
            className={`flex items-center gap-2 ${step === 'info' ? 'text-primary font-medium' : step === 'document' || step === 'selfie' ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'info' ? 'bg-primary text-primary-foreground' : step === 'document' || step === 'selfie' ? 'bg-primary/20 text-primary' : 'bg-muted'}`}
            >
              1
            </div>
            <span>Personal Info</span>
          </div>
          <div className="flex-1 h-px bg-border" />
          <div
            className={`flex items-center gap-2 ${step === 'document' ? 'text-primary font-medium' : step === 'selfie' ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'document' ? 'bg-primary text-primary-foreground' : step === 'selfie' ? 'bg-primary/20 text-primary' : 'bg-muted'}`}
            >
              2
            </div>
            <span>Document</span>
          </div>
          <div className="flex-1 h-px bg-border" />
          <div
            className={`flex items-center gap-2 ${step === 'selfie' ? 'text-primary font-medium' : 'text-muted-foreground'}`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${step === 'selfie' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
            >
              3
            </div>
            <span>Selfie</span>
          </div>
        </div>

        {/* Personal Information */}
        {step === 'info' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name (as per ID)</Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                value={personalInfo.fullName}
                onChange={(e) =>
                  setPersonalInfo({ ...personalInfo, fullName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={personalInfo.dateOfBirth}
                onChange={(e) =>
                  setPersonalInfo({
                    ...personalInfo,
                    dateOfBirth: e.target.value,
                  })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="idType">ID Type</Label>
                <Select
                  value={personalInfo.idType}
                  onValueChange={(value) =>
                    setPersonalInfo({ ...personalInfo, idType: value })
                  }
                >
                  <SelectTrigger id="idType">
                    <SelectValue placeholder="Select ID type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="passport">Passport</SelectItem>
                    <SelectItem value="drivers-license">
                      Driver's License
                    </SelectItem>
                    <SelectItem value="national-id">National ID</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="idNumber">ID Number</Label>
                <Input
                  id="idNumber"
                  placeholder="ID123456789"
                  value={personalInfo.idNumber}
                  onChange={(e) =>
                    setPersonalInfo({
                      ...personalInfo,
                      idNumber: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Residential Address</Label>
              <Input
                id="address"
                placeholder="123 Main St, City, Country"
                value={personalInfo.address}
                onChange={(e) =>
                  setPersonalInfo({ ...personalInfo, address: e.target.value })
                }
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={onBack}
                className="flex-1 bg-transparent"
              >
                Back
              </Button>
              <Button onClick={handleInfoSubmit} className="flex-1">
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Document Upload */}
        {step === 'document' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-2">
              <Label>Upload ID Document</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setDocumentFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="document-upload"
                />
                <label htmlFor="document-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                      <svg
                        className="w-6 h-6 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {documentFile
                          ? documentFile.name
                          : 'Click to upload or drag and drop'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG or PDF (max. 10MB)
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium">Document Requirements:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Clear, high-quality image or scan</li>
                <li>All corners of the document visible</li>
                <li>Text must be readable</li>
                <li>No glare or shadows</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('info')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleDocumentSubmit}
                className="flex-1"
                disabled={!documentFile}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Selfie Capture */}
        {step === 'selfie' && (
          <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
            <div className="space-y-2">
              <Label>Take a Selfie</Label>
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={(e) => setSelfieFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="selfie-upload"
                />
                <label htmlFor="selfie-upload" className="cursor-pointer">
                  <div className="space-y-2">
                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto">
                      <svg
                        className="w-6 h-6 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {selfieFile
                          ? selfieFile.name
                          : 'Click to capture selfie'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Face recognition for identity verification
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg space-y-2">
              <p className="text-sm font-medium">Selfie Guidelines:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Face the camera directly</li>
                <li>Remove glasses and hats</li>
                <li>Ensure good lighting</li>
                <li>Keep a neutral expression</li>
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('document')}
                className="flex-1"
              >
                Back
              </Button>
              <Button
                onClick={handleSelfieSubmit}
                className="flex-1"
                disabled={!selfieFile}
              >
                Continue
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
