import { createAction, props } from '@ngrx/store';
import { AppTheme } from './ui.state';

export const toggleSidebar = createAction('[UI] Toggle Sidebar');

export const setMobileSidebarOpen = createAction(
  '[UI] Set Mobile Sidebar Open',
  props<{ open: boolean }>(),
);

export const toggleMobileSidebar = createAction('[UI] Toggle Mobile Sidebar');

export const setSidebarCollapsed = createAction(
  '[UI] Set Sidebar Collapsed',
  props<{ collapsed: boolean }>(),
);

export const setTheme = createAction('[UI] Set Theme', props<{ theme: AppTheme }>());

export const toggleTheme = createAction('[UI] Toggle Theme');

export const setGlobalLoading = createAction(
  '[UI] Set Global Loading',
  props<{ loading: boolean }>(),
);
