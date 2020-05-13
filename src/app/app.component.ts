import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  loggedIn: boolean;
  darkMode: boolean;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    this.setDarkMode();
  }

  setDarkMode() {
    this.darkMode = !!localStorage.getItem('darkMode');
    if (this.darkMode) {
      document.body.classList.add('dark');
    }
  }

  toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark');
    if (isDark) {
      localStorage.setItem('darkMode', 'enabled');
    } else {
      localStorage.removeItem('darkMode');
    }
  }
}
