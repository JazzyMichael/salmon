import { Component, HostListener } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { AuthService } from './services/auth.service';
import { Plugins } from '@capacitor/core';
import { SwUpdate } from '@angular/service-worker';

const { Storage, Share, Clipboard } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  darkMode: boolean;
  deferredPrompt: any;

  constructor(
    public auth: AuthService,
    private platform: Platform,
    private toaster: ToastController,
    private swUpdates: SwUpdate
  ) {
    this.initializeApp();
  }

  initializeApp() {
    // this.platform.ready().then(() => {
    //   this.statusBar.styleDefault();
    //   this.splashScreen.hide();
    // });

    Storage.get({ key: 'darkMode' }).then(val => {
      if (val) {
        this.darkMode = true;
        document.body.classList.add('dark');
      }
    });

    this.swUpdates.available.subscribe(event => {
      this.swUpdates.activateUpdate()
        .then(() => document.location.reload())
        .catch(e => console.log('error updating app', e));
    });
  }

  @HostListener('window:beforeinstallprompt', ['$event'])
  onbeforeinstallprompt(e: any) {
    e.preventDefault();
    this.deferredPrompt = e;
  }

  async installPWA() {
    this.deferredPrompt.prompt();

    const { outcome } = await this.deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      this.deferredPrompt = null;
    }
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
