import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'log-in', component: LogInComponent },
  { path: 'sign-up', component: SignUpComponent },
  { path: '**', component: LogInComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
