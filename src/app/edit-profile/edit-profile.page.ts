import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastController } from '@ionic/angular';
import { SEOService } from '../services/seo.service';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  userForm: FormGroup;

  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    private seo: SEOService,
    private toast: ToastController,
    private userService: UserService
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

}
