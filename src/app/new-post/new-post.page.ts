import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SEOService } from '../services/seo.service';
import { ToastController } from '@ionic/angular';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireStorage } from '@angular/fire/storage';
import { ImageCropComponent } from './image-crop/image-crop.component';
import { ModalController } from '@ionic/angular';

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
    private fireStorage: AngularFireStorage,
    private modalController: ModalController
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

  async compressImage(file: File | Blob) {
    const options = {
      maxSizeMB: 2,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };
    const compressedFile = await imageCompression(file, options);
    if (compressedFile.size < file.size) {
      console.log(`original image file size: ${file.size / 1024 / 1024} MB`);
      console.log(`using compressed image: ${compressedFile.size / 1024 / 1024} MB`);
      return compressedFile;
    } else {
      console.log(`image file size: ${file.size / 1024 / 1024} MB`);
      return file;
    }
  }

  async addImage(event: any) {
    const file = event.target.files[0];
    const files = event.target.files;

    if (!file || file.type.split('/')[0] !== 'image' || file.size / 1024 / 1024 > 24 || files.length > 5) {
      console.log('bad upload');
      return;
    }

    const compressedImage = await this.compressImage(file);

    const modal = await this.modalController.create({
      component: ImageCropComponent,
      componentProps: {
        imageFile: compressedImage
      }
    });

    await modal.present();

    try {
      const { data } = await modal.onWillDismiss();

      if (!data) throw new Error('dismissed with no data');

      const { croppedImage, cropperPosition, imageFile, cancel } = data;

      if (!cancel && croppedImage) {
        this.images.push({ file: imageFile, preview: croppedImage, cropperPosition });
      }

      if (!cancel && files.length > 1) {
        for (const uploadedFile of files) {
          const imgFile = uploadedFile && uploadedFile.name !== file.name ? uploadedFile : null;
          if (imgFile && imgFile.type.split('/')[0] === 'image' && file.size / 1024 / 1024 < 24) {
            const compre = await this.compressImage(imgFile);
            const reader = new FileReader();
            reader.onload = (e: any) => {
              const preview = this.sanitizer.bypassSecurityTrustUrl(e.target.result as string);
              this.images.push({ file: compre, preview });
            };
            reader.readAsDataURL(compre);
          }
        }
      }

    } catch (e) {
      console.log('oops', e);
    }

  }

  async reCrop(index: number) {
    const image = this.images[index];

    const modal = await this.modalController.create({
      component: ImageCropComponent,
      componentProps: {
        imageFile: image.file,
        cropperPosition: image.cropperPosition
      }
    });

    await modal.present();

    const { data } = await modal.onWillDismiss();

    if (!data) {
      return;
    }

    const { croppedImage, cropperPosition, imageFile, cancel } = data;

    if (!cancel) {
      this.images[index] = { file: imageFile, preview: croppedImage, cropperPosition };
    }
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

    const smallTitle = this.postForm.value.title.replace(/\s/g, '').substring(0, 10);

    for (const [index, img] of this.images.entries()) {
      const path = `posts/${userId}/` + smallTitle + `-${index}.${img.file.type.split('/')[1]}`;
      this.images[index].path = path;
      const task = this.fireStorage.upload(path, img.file);
      imgUploads.push(task);
    }

    const uploaded = await Promise.all(imgUploads);

    const imgs = [];

    for (const img of this.images) {
      const storageRef = this.fireStorage.ref(img.path);
      const downloadUrl = await storageRef.getDownloadURL().toPromise();
      imgs.push({ path: img.path, url: downloadUrl });
    }

    const newPost = {
      title: this.postForm.value.title.trim(),
      location: `${this.postForm.value.location || ''}`.trim(),
      description: `${this.postForm.value.description || ''}`.trim(),
      userId,
      createdAt: new Date(),
      likes: 0,
      images: imgs
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
