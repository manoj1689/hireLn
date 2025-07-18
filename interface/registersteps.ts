// types/registerSteps.ts

export interface RegisterStep1Payload {
  firstName: string;
  lastName: string;
  workEmail: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterStep2Payload {
  companyName: string;
  companySize: string;
  industry: string;
  hiringVolume: string;
  primaryHiringNeeds: string[];
  sessionId: string;
}

export interface RegisterStep3Payload {
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  billingAddress: string;
  city: string;
  zipCode: string;
  termsAgreement: boolean;
  sessionId: string;
}

