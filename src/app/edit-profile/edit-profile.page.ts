import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { SEOService } from '../services/seo.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

import imageCompression from 'browser-image-compression';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  constructor(
    public auth: AuthService,
    private seo: SEOService,
    private toast: ToastController,
    private userService: UserService,
    private fireStorage: AngularFireStorage
  ) { }

  ngOnInit() {
    this.seo.updateTags({});
  }

  async save(uid: string, field: string, value: string) {
    await this.userService.update(uid, field, value);
    const toasty = await this.toast.create({
      message: `${field.substring(0, 1).toUpperCase()}${field.substring(1)} has been updated!`,
      duration: 3000
    });
    toasty.present();
  }

  async changeAvatar(event: any, uid: string) {
    const file = event.target.files[0];

    if (!uid || !file || file.type.split('/')[0] !== 'image' || file.size / 1024 / 1024 > 24) {
      console.log('only small imgs dood');
      return;
    }

    console.log(`original file size: ${file.size / 1024 / 1024} MB`);

    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };

    const compressedFile = await imageCompression(file, options);

    console.log(`compressed file size: ${compressedFile.size / 1024 / 1024} MB`);

    const path = `avatars/${uid}-avatar.${file.type.split('/')[1]}`;
    await this.fireStorage.upload(path, compressedFile);
    const ref = this.fireStorage.ref(path);
    const downloadURL = await ref.getDownloadURL().toPromise();

    await this.userService.update(uid, 'avatar', downloadURL);
  }

}
