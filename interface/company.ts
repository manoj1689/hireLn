// types/company.ts
export interface SocialMedia {
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
}

export interface CompanyRequest {
  name: string;
  description: string;
  industry: string;
  founded: number;
  companySize: string;
  website: string;
  email: string;
  phone: string;
  taxId: string;
  logo: string;
  coverImage: string;
  primaryColor: string;
  secondaryColor: string;
  careerHeadline: string;
  careerDescription: string;
  featuredImages: string[];
  socialMedia: SocialMedia;
  remoteWorkPolicy: string;
  remoteHiringRegions: string[];
}

export interface CompanyFormData {
  name: string;
  industry: string;
  description: string;
  founded: number;
  companySize: string;
  website: string;
  email: string;
  phone: string;
  taxId: string;
  logo: string;
  coverImage: string;
  primaryColor: string;
  secondaryColor: string;
  careerHeadline: string;
  careerDescription: string;
  featuredImages: string[];
  remoteWorkPolicy: string;
  remoteHiringRegions: string[];
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
}

export interface CompanyResponse extends CompanyRequest {
  id: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}


export interface CompanyLocationRequest {
  name: string;
  type: 'office' | 'remote' | 'hybrid';
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  phone: string;
  email: string;
  isHeadquarters: boolean;
}

export interface CompanyLocationResponse extends CompanyLocationRequest {
  id: string;
  companyId: string;
  createdAt: string;
  updatedAt: string;
}


