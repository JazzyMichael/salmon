import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.page.html',
  styleUrls: ['./new-post.page.scss'],
})
export class NewPostPage implements OnInit {
  postForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) { }

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      location: [''],
      description: ['']
    });
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
