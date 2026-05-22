import { ActivityType } from '../../core/models';

export interface ActivityTypeMeta {
  icon: string;
  label: string;
  color: string;
}

export const ACTIVITY_TYPE_META: Record<ActivityType, ActivityTypeMeta> = {
  call: { icon: 'call', label: 'Call', color: '#3b82f6' },
  email: { icon: 'email', label: 'Email', color: '#8b5cf6' },
  meeting: { icon: 'groups', label: 'Meeting', color: '#16a34a' },
  task: { icon: 'task_alt', label: 'Task', color: '#f97316' },
  note: { icon: 'sticky_note_2', label: 'Note', color: '#64748b' },
  'deal-update': { icon: 'trending_up', label: 'Deal Update', color: '#2563eb' },
  'contact-created': { icon: 'person_add', label: 'Contact Created', color: '#0d9488' },
};

export const LOGGABLE_ACTIVITY_TYPES: ActivityType[] = ['call', 'email', 'meeting', 'task', 'note'];

export const DUE_DATE_ACTIVITY_TYPES: ActivityType[] = ['call', 'meeting', 'task'];
