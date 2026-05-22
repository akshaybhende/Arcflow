import { ActionReducerMap } from '@ngrx/store';
import { ActivitiesState, activitiesReducer } from './activities/activities.reducer';
import { CompaniesState, companiesReducer } from './companies/companies.reducer';
import { ContactsState, contactsReducer } from './contacts/contacts.reducer';
import { DealsState, dealsReducer } from './deals/deals.reducer';
import { uiReducer } from './ui/ui.reducer';
import { UiState } from './ui/ui.state';

export interface AppState {
  contacts: ContactsState;
  deals: DealsState;
  companies: CompaniesState;
  activities: ActivitiesState;
  ui: UiState;
}

export const reducers: ActionReducerMap<AppState> = {
  contacts: contactsReducer,
  deals: dealsReducer,
  companies: companiesReducer,
  activities: activitiesReducer,
  ui: uiReducer,
};
