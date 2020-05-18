import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SEOService } from '../services/seo.service';
import { ToastController } from '@ionic/angular';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.page.html',
  styleUrls: ['./new-post.page.scss'],
})
export class NewPostPage implements OnInit {
  postForm: FormGroup;
  images: any[];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastController,
    private seo: SEOService,
    private postService: PostService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.buildForm();
    this.seo.updateTags({});
  }

  buildForm() {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      location: [''],
      description: ['']
    });
    this.images = [];
  }

  addImage(event: any) {
    const file = event.target.files[0];

    if (file.type.split('/')[0] !== 'image') {
      console.log('only imgs dood');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.images.push({
        a: this.images.length,
        file,
        preview: e.target.result
      });
    };
    reader.readAsDataURL(file);
  }

  onReorder(event: any) {
    const { to, from } = event.detail;
    if (!this.images[to] || !this.images[from]) {
      event.detail.complete();
      return;
    }
    const temp = this.images[to];
    this.images[to] = this.images[from];
    this.images[from] = temp;
    console.log(`reorder from ${from} to ${to}`, this.images);
    event.detail.complete();
  }

  async submit() {
    const userId = this.auth.uid;
    if (!userId) return;

    const newPost = {
      title: this.postForm.value.title.trim(),
      location: `${this.postForm.value.location || ''}`.trim(),
      description: `${this.postForm.value.description || ''}`.trim(),
      userId,
      createdAt: new Date(),
      likes: 0,
      images: []
    };

    const { id } = await this.postService.create(newPost);

    this.postForm.reset();

    const toasty = await this.toast.create({
      message: 'Your Salmon has been published!',
      duration: 3000
    });
    toasty.present();

    this.router.navigateByUrl(`/post/${id}`);
  }

}
