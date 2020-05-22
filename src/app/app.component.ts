import { Component } from '@angular/core';

import { Platform, ToastController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { Plugins } from '@capacitor/core';

const { Storage, Share, Clipboard } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  darkMode: boolean;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private toaster: ToastController,
    public auth: AuthService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });

    Storage.get({ key: 'darkMode' }).then(val => {
      if (val) {
        this.darkMode = true;
        document.body.classList.add('dark');
      }
    });
  }

  async toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark');
    if (isDark) {
      await Storage.set({ key: 'darkMode', value: 'enabled' });
    } else {
      await Storage.remove({ key: 'darkMode' });
    }
  }

  async share() {
    try {
      await Share.share({
        title: 'The Art of Cooking Salmon',
        text: 'Beautiful & tasty, Lets Eat! Share your Salmon at The Art of Cooking Salmon .com! ',
        url: 'http://theartofcookingsalmon.com/',
        dialogTitle: 'Share'
      });
    } catch (e) {
      // desktop
      await Clipboard.write({
        string: 'https://theartofcookingsalmon.com'
      });
      const toast = await this.toaster.create({
        message: 'Link Copied :)',
        duration: 2345,
        position: 'top'
      });
      toast.present();
    }
  }

}
