import { Address } from './contact.model';

export type CompanySize = '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1000+';
export type CompanyIndustry =
  | 'technology'
  | 'finance'
  | 'healthcare'
  | 'retail'
  | 'manufacturing'
  | 'education'
  | 'consulting'
  | 'other';

export interface Company {
  id: string;
  name: string;
  domain?: string;
  logo?: string;
  industry: CompanyIndustry;
  size: CompanySize;
  revenue?: number;
  phone?: string;
  email?: string;
  website?: string;
  address?: Address;
  contactIds: string[];
  dealIds: string[];
  notes?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}
