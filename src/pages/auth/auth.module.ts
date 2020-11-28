import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from './../../modules/material.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AuthPageRoutingModule } from './auth-routing.module';

import { AuthPage } from './auth.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    IonicModule,
    MaterialModule,
    AuthPageRoutingModule
  ],
  declarations: [AuthPage]
})
export class AuthPageModule {}
