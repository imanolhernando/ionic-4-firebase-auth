import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { TranslateService } from '@ngx-translate/core';

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
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.setLanguage();
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  setLanguage() {
    this.translateService.addLangs(['es', 'en']);
    this.translateService.setDefaultLang('es');
    const browserLang = this.translateService.getBrowserLang();
    this.translateService.use(browserLang.match(/es|en/) ? browserLang : 'es');
  }

}
