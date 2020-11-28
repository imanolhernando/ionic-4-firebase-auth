import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import {ComponentesService  } from '../services/componentes/componentes.service';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from './../environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';
import {AutorizacionService  } from '../services/autorizacion/autorizacion.service';
import { GooglePlus } from '@ionic-native/google-plus/ngx'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Globalization } from '@ionic-native/globalization/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 

import { FlexLayoutModule } from '@angular/flex-layout';
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFireModule,
    HttpClientModule,
    FlexLayoutModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (createTranslateLoader),
          deps: [HttpClient]
        }
      })
    ],
  providers: [
    StatusBar,
    SplashScreen,
    AutorizacionService,
    ComponentesService,
    AngularFirestore,
    GooglePlus,
    Globalization,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
