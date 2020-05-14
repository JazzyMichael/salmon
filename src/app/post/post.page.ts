import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  post$: Observable<any>;
  editable: boolean;
  testDate: any;
  slideOpts: any = {
    autoHeight: true
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.post$ = this.route.paramMap.pipe(
      switchMap(params => of(params.get('id'))),
      // get post by id
    );
    this.editable = false;
    this.testDate = new Date();
  }

  edit() {
    this.router.navigateByUrl('/edit-post');
  }

}
