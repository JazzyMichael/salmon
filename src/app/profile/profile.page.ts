import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileUser$: Observable<any>;
  editable: boolean;s

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    // get param id (userUrl)
    // redirect if no user
    // get user by userUrl
    this.profileUser$ = this.route.paramMap.pipe(
      switchMap(params => {
        return of({ urlExtension: params.get('id') });
      })
    );

    const randy = Math.random();
    if (randy > 0.75) {
      console.log('that user does not exist');
      this.router.navigateByUrl('/about');
    } else if (randy > 0.2) {
      this.editable = true;
    }
  }

  edit() {
    this.router.navigateByUrl('/');
  }

}
