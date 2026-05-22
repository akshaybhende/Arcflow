import { CompanyIndustry, CompanySize } from '../../core/models';

export const INDUSTRY_LABELS: Record<CompanyIndustry, string> = {
  technology: 'Technology',
  finance: 'Finance',
  healthcare: 'Healthcare',
  retail: 'Retail',
  manufacturing: 'Manufacturing',
  education: 'Education',
  consulting: 'Consulting',
  other: 'Other',
};

export const SIZE_LABELS: Record<CompanySize, string> = {
  '1-10': '1–10',
  '11-50': '11–50',
  '51-200': '51–200',
  '201-500': '201–500',
  '501-1000': '501–1,000',
  '1000+': '1,000+',
};

export const INDUSTRIES: CompanyIndustry[] = [
  'technology',
  'finance',
  'healthcare',
  'retail',
  'manufacturing',
  'education',
  'consulting',
  'other',
];

export const SIZES: CompanySize[] = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
