export type ActivityType =
  | 'call'
  | 'email'
  | 'meeting'
  | 'task'
  | 'note'
  | 'deal-update'
  | 'contact-created';
export type ActivityStatus = 'pending' | 'completed' | 'cancelled';

export interface Activity {
  id: string;
  type: ActivityType;
  title: string;
  description?: string;
  contactId?: string;
  contactName?: string;
  dealId?: string;
  dealName?: string;
  companyId?: string;
  status: ActivityStatus;
  dueDate?: string;
  completedAt?: string;
  owner: string;
  createdAt: string;
  updatedAt: string;
}
