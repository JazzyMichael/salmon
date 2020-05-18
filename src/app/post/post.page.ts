import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { SEOService } from '../services/seo.service';
import { PostService } from '../services/post.service';
import { AuthService } from '../services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit, OnDestroy {
  post: any;
  editable: boolean;
  slideOpts: any = {
    autoHeight: true
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seo: SEOService,
    private postService: PostService,
    private auth: AuthService,
    private location: Location
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => of(params.get('id'))),
      switchMap(id => this.postService.getById(id)),
      catchError(error => of(this.router.navigateByUrl('/')))
    )
    .subscribe(post => {
      console.log(post);
      this.post = post;
      this.editable = this.post.userId && this.post.userId === this.auth.uid;
      this.seo.updateTags({
        title: `${this.post.title} | Salmon`,
        description: `${this.post.description} ${this.post.location}. The Art of Cooking Salmon.`,
        url: `https://theartofcookingsalmon.com${this.location.path()}`,
        imageUrl: ''
      });
    });
  }

  ngOnDestroy() {
    this.seo.updateTags({});
  }

  edit() {
    return;
  }

}
