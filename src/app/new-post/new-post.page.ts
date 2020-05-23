import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SEOService } from '../services/seo.service';
import { ToastController } from '@ionic/angular';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireStorage } from '@angular/fire/storage';

import imageCompression from 'browser-image-compression';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.page.html',
  styleUrls: ['./new-post.page.scss'],
})
export class NewPostPage implements OnInit {
  postForm: FormGroup;
  images: any[];
  loading: boolean;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toast: ToastController,
    private seo: SEOService,
    private postService: PostService,
    private auth: AuthService,
    private sanitizer: DomSanitizer,
    private fireStorage: AngularFireStorage
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

  resetForm() {
    this.postForm.reset();
    this.images = [];
  }

  async addImage(event: any) {
    const file = event.target.files[0];

    if (!file || file.type.split('/')[0] !== 'image' || file.size / 1024 / 1024 > 24) {
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

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const preview = this.sanitizer.bypassSecurityTrustUrl(e.target.result as string);
      this.images.push({ file: compressedFile, preview });
    };
    reader.readAsDataURL(compressedFile);
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
    event.detail.complete();
  }

  async submit() {
    const userId = this.auth.uid;
    if (!userId) return;

    this.loading = true;

    const imgUploads = [];

    for (const [index, img] of this.images.entries()) {
      const path = `posts/${userId}/` + Math.random().toString().slice(3, 11) + `.${img.file.type.split('/')[1]}`;
      this.images[index].path = path;
      const task = this.fireStorage.upload(path, img.file);
      imgUploads.push(task);
    }

    const uploaded = await Promise.all(imgUploads);

    const imgUrls = [];

    for (const img of this.images) {
      const storageRef = this.fireStorage.ref(img.path);
      const downloadUrl = await storageRef.getDownloadURL().toPromise();
      imgUrls.push(downloadUrl);
    }

    const newPost = {
      title: this.postForm.value.title.trim(),
      location: `${this.postForm.value.location || ''}`.trim(),
      description: `${this.postForm.value.description || ''}`.trim(),
      userId,
      createdAt: new Date(),
      likes: 0,
      images: imgUrls
    };

    const { id } = await this.postService.create(newPost);

    this.resetForm();
    this.loading = false;

    const toasty = await this.toast.create({
      message: 'Your Salmon has been published and it looks great!',
      duration: 3000
    });
    toasty.present();

    await this.router.navigateByUrl(`/post/${id}`);
  }

}
