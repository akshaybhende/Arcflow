import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactsList } from './contacts-list/contacts-list';
import { ContactDetail } from './contact-detail/contact-detail';
import { ContactForm } from './contact-form/contact-form';

const routes: Routes = [
  { path: '', component: ContactsList },
  { path: 'new', component: ContactForm },
  { path: ':id/edit', component: ContactForm },
  { path: ':id', component: ContactDetail },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ContactsRoutingModule {}
