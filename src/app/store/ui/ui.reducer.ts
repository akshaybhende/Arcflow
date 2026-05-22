import { createReducer, on } from '@ngrx/store';
import * as UiActions from './ui.actions';
import { initialUiState, UiState } from './ui.state';

export const uiReducer = createReducer(
  initialUiState,
  on(UiActions.toggleSidebar, (state): UiState => ({
    ...state,
    sidebarCollapsed: !state.sidebarCollapsed,
  })),
  on(UiActions.setSidebarCollapsed, (state, { collapsed }): UiState => ({
    ...state,
    sidebarCollapsed: collapsed,
  })),
  on(UiActions.setTheme, (state, { theme }): UiState => ({
    ...state,
    theme,
  })),
  on(UiActions.toggleTheme, (state): UiState => ({
    ...state,
    theme: state.theme === 'light' ? 'dark' : 'light',
  })),
  on(UiActions.setGlobalLoading, (state, { loading }): UiState => ({
    ...state,
    globalLoading: loading,
  })),
);
