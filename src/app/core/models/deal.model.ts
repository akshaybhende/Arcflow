export type DealStage = 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type DealPriority = 'low' | 'medium' | 'high';

export interface Deal {
  id: string;
  title: string;
  contactId: string;
  contactName: string;
  companyName?: string;
  stage: DealStage;
  value: number;
  currency: string;
  priority: DealPriority;
  probability: number;
  expectedCloseDate: string;
  actualCloseDate?: string;
  owner: string;
  tags: string[];
  notes?: string;
  activityIds: string[];
  createdAt: string;
  updatedAt: string;
}
