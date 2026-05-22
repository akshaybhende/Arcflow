export type AppTheme = 'light' | 'dark';

export interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface UiState {
  theme: AppTheme;
  sidebarCollapsed: boolean;
  mobileSidebarOpen: boolean;
  globalLoading: boolean;
  notifications: Notification[];
}

export const initialUiState: UiState = {
  theme: 'light',
  sidebarCollapsed: false,
  mobileSidebarOpen: false,
  globalLoading: false,
  notifications: [],
};
