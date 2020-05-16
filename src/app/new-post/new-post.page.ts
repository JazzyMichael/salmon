import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SEOService } from '../services/seo.service';

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
    private seo: SEOService
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

  submit() {
    const newPost = {
      title: this.postForm.value.title.trim(),
      location: `${this.postForm.value.location}`.trim(),
      description: `${this.postForm.value.description}`.trim(),
      userId: 'uid123',
      createdAt: new Date(),
      likes: 0,
      images: []
    };
    console.log(newPost);
    this.postForm.reset();
    const postUrl = '/';
    this.router.navigateByUrl(postUrl);
  }

}
