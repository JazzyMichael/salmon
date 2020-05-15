import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SEOService } from '../services/seo.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  userForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private seo: SEOService
  ) { }

  ngOnInit() {
    this.createForm();
    this.seo.updateTags({});
  }

  createForm() {
    this.userForm = this.fb.group({
      username: ['', Validators.required],
      urlExtension: ['', Validators.required],
      avatar: [''],
      bio: [''],
      location: [''],
      facebookUrl: [''],
      instagramUrl: [''],
      twitterUrl: [''],
      otherLinkUrl: ['']
    });
  }

  save() {
    console.log(this.userForm.value);
    this.userForm.reset();
  }

}
