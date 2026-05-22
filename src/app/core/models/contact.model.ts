export type ContactStatus = 'active' | 'inactive' | 'prospect' | 'customer' | 'churned';
export type LeadSource = 'website' | 'referral' | 'social' | 'email' | 'cold-call' | 'event' | 'other';

export interface Address {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
}

export interface SocialLinks {
  linkedin?: string;
  twitter?: string;
  website?: string;
}

export interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle?: string;
  companyId?: string;
  companyName?: string;
  status: ContactStatus;
  leadSource: LeadSource;
  avatar?: string;
  tags: string[];
  notes?: string;
  address?: Address;
  socialLinks?: SocialLinks;
  dealIds: string[];
  activityIds: string[];
  createdAt: string;
  updatedAt: string;
  lastContactedAt?: string;
  owner: string;
}
