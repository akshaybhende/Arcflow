import { ContactStatus, LeadSource } from '../../core/models';

export const CONTACT_STATUS_LABELS: Record<ContactStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  prospect: 'Prospect',
  customer: 'Customer',
  churned: 'Churned',
};

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  website: 'Website',
  referral: 'Referral',
  social: 'Social',
  email: 'Email',
  'cold-call': 'Cold Call',
  event: 'Event',
  other: 'Other',
};

export const CONTACT_STATUS_OPTIONS: { value: ContactStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'prospect', label: 'Prospect' },
  { value: 'customer', label: 'Customer' },
  { value: 'churned', label: 'Churned' },
  { value: 'inactive', label: 'Inactive' },
];

export const LEAD_SOURCE_OPTIONS: { value: LeadSource | 'all'; label: string }[] = [
  { value: 'all', label: 'All sources' },
  { value: 'website', label: 'Website' },
  { value: 'referral', label: 'Referral' },
  { value: 'social', label: 'Social' },
  { value: 'email', label: 'Email' },
  { value: 'cold-call', label: 'Cold Call' },
  { value: 'event', label: 'Event' },
  { value: 'other', label: 'Other' },
];

export function contactStatusClass(status: ContactStatus): string {
  return `status-badge status-badge--${status}`;
}
