import { Component, OnInit } from '@angular/core';
import { SEOService } from '../services/seo.service';
import { PostService } from '../services/post.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  sort: string;
  posts$: Observable<any[]>;

  constructor(
    private seo: SEOService,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.sort = 'recent';
    this.posts$ = this.postService.getAll(this.sort);
  }

  ionViewDidEnter() {
    this.seo.updateTags({});
  }

  changeSort() {
    this.sort = this.sort === 'recent' ? 'top' : 'recent';
    this.posts$ = this.postService.getAll(this.sort);
  }

}
