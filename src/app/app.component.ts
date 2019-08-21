import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import 'firebase/auth';
import { TranslateService } from '@ngx-translate/core';
import { Globalization } from '@ionic-native/globalization/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private translateService: TranslateService,
    private globalization: Globalization,
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.translateService.setDefaultLang('en');
      this.setLanguage();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
  setLanguage(){
    if (this.platform.is('cordova')) {
      this.globalization.getPreferredLanguage()
      .then(res => {
          console.log("language ",res.value);
          this.translateService.use(res.value.substring(0, 2).toLowerCase());
      }).catch(e => {
          console.error(e);
      });
    }else{
      var language = navigator.language; 
      console.log("language ",language) ;
      this.translateService.use(language.substring(0, 2).toLowerCase());
    } 
  }
 
}
