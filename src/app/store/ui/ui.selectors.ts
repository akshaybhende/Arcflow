import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UiState } from './ui.state';

export const selectUiState = createFeatureSelector<UiState>('ui');

export const selectSidebarCollapsed = createSelector(
  selectUiState,
  (state) => state.sidebarCollapsed,
);

export const selectTheme = createSelector(selectUiState, (state) => state.theme);

export const selectGlobalLoading = createSelector(
  selectUiState,
  (state) => state.globalLoading,
);

export const selectNotifications = createSelector(
  selectUiState,
  (state) => state.notifications,
);

export const selectUnreadNotificationCount = createSelector(
  selectNotifications,
  (notifications) => notifications.filter((n) => !n.read).length,
);
