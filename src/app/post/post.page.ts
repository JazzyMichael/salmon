import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { SEOService } from '../services/seo.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit, OnDestroy {
  post$: Observable<any>;
  editable: boolean;
  testDate: any;
  slideOpts: any = {
    autoHeight: true
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seo: SEOService
  ) { }

  ngOnInit() {
    this.post$ = this.route.paramMap.pipe(
      switchMap(params => of(params.get('id'))),
      // get post by id
    );
    this.editable = false;
    this.testDate = new Date();

    this.seo.updateTags({
      title: 'Post title - Salmon',
      description: 'Post title - post description - The Art of Cooking Salmon',
      url: 'https://theartofcookingsalmon.com',
      imageUrl: ''
    });
  }

  ngOnDestroy() {
    this.seo.updateTags({});
  }

  edit() {
    this.router.navigateByUrl('/edit-post');
  }

}
