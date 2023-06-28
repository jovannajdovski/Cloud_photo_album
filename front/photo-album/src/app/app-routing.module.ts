import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { AuthGuard } from './guards/auth.guard';
import { FamilyMemberRegistrationComponent } from './components/family-member-registration/family-member-registration.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [AuthGuard],
    component: HomeComponent
  },
  { path: 'log-in', component: LogInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: 'family-member-invitation', component: FamilyMemberRegistrationComponent },
  { path: '**', component: LogInComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
