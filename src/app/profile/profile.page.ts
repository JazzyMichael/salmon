import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { SEOService } from '../services/seo.service';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {
  user: any;
  userPosts$: Observable<any[]>;

  constructor(
    public auth: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private seo: SEOService,
    private userService: UserService,
    private postService: PostService
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap(params => of(params.get('id'))),
      switchMap((userId: string) => this.userService.getById(userId)),
      catchError(async (error: any) => {
        console.log('Oops', error);
        await this.router.navigateByUrl('/');
        return of(null);
      })
    ).subscribe((user: any) => {
      if (!user) return this.router.navigateByUrl('/');
      this.user = user;

      this.userPosts$ = this.postService.getByUserId(user.uid);

      this.seo.updateTags({
        title: `${user.username} Salmon`,
        description: `The Art of Cooking Salmon presents ${user.username}! ${user.bio} ${user.location}`,
        url: `https://theartofcookingsalmon/profile/${user.uid}`,
        imageUrl: user.avatar || ''
      });
    });
  }

  ngOnDestroy() {
    this.seo.updateTags({});
  }

  socialClick(link: string) {
    console.log('navigate to ', link);
  }

}
