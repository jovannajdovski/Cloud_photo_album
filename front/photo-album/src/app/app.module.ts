import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LogInComponent } from './components/log-in/log-in.component';
import { SignUpComponent } from './components/sign-up/sign-up.component';
import { SuccOrFailMessageComponent } from './components/succ-or-fail-message/succ-or-fail-message.component';
import { HomeComponent } from './components/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material/material.module';
import { AddContentDialogComponent } from './components/add-content-dialog/add-content-dialog.component'
import {Amplify} from 'aws-amplify';
import { EditContentDialogComponent } from './components/edit-content-dialog/edit-content-dialog.component';
// import awsconfig from '../aws-exports.js';
// Amplify.configure(awsconfig);

@NgModule({
  declarations: [
    AppComponent,
    LogInComponent,
    SignUpComponent,
    SuccOrFailMessageComponent,
    HomeComponent,
    NavbarComponent,
    AddContentDialogComponent,
    EditContentDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
