import { DealPriority, DealStage } from '../../core/models';

export const STAGE_LABELS: Record<DealStage, string> = {
  lead: 'Lead',
  qualified: 'Qualified',
  proposal: 'Proposal',
  negotiation: 'Negotiation',
  won: 'Won',
  lost: 'Lost',
};

export const STAGE_COLORS: Record<DealStage, string> = {
  lead: 'var(--color-stage-lead)',
  qualified: 'var(--color-stage-qualified)',
  proposal: 'var(--color-stage-proposal)',
  negotiation: 'var(--color-stage-negotiation)',
  won: 'var(--color-stage-won)',
  lost: 'var(--color-stage-lost)',
};

export const PRIORITY_COLORS: Record<DealPriority, string> = {
  low: 'var(--color-success)',
  medium: 'var(--color-warning)',
  high: 'var(--color-danger)',
};
