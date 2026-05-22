export type UserRole = 'admin' | 'manager' | 'sales-rep';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  department?: string;
}
