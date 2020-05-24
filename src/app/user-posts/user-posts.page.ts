import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from '../services/post.service';
import { switchMap, tap, catchError } from 'rxjs/operators';
import { of, Observable } from 'rxjs';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-posts',
  templateUrl: './user-posts.page.html',
  styleUrls: ['./user-posts.page.scss'],
})
export class UserPostsPage implements OnInit {
  posts$: Observable<any[]>;
  userId: string;
  username: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.posts$ = this.route.paramMap.pipe(
      switchMap(params => of(params.get('id'))),
      switchMap((id: string) => this.userService.getById(id)),
      switchMap(({ username, uid }) => {
        this.userId = uid;
        this.username = username;
        return of(uid);
      }),
      switchMap((id: string) => this.postService.getByUserId(id)),
      tap((posts: any[] = []) => {
        if (!posts.length) this.router.navigateByUrl('/');
      }),
      catchError((error: any) => {
        console.log('Oops', error);
        this.router.navigateByUrl('/');
        return of([]);
      })
    );
  }

}
