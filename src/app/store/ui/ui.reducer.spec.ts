import * as UiActions from './ui.actions';
import { initialUiState } from './ui.state';
import { uiReducer } from './ui.reducer';

describe('uiReducer', () => {
  it('toggles sidebar collapsed state', () => {
    const state = uiReducer(initialUiState, UiActions.toggleSidebar());
    expect(state.sidebarCollapsed).toBe(true);
  });

  it('sets mobile sidebar open state', () => {
    const state = uiReducer(initialUiState, UiActions.setMobileSidebarOpen({ open: true }));
    expect(state.mobileSidebarOpen).toBe(true);
  });

  it('toggles theme', () => {
    const state = uiReducer(initialUiState, UiActions.toggleTheme());
    expect(state.theme).toBe('dark');
  });
});
