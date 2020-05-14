import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: BehaviorSubject<any>;

  constructor(
    private router: Router
  ) {
    this.user$ = new BehaviorSubject(null);
  }

  login() {
    this.user$.next({
      username: 'Jazzy Salmon',
      uid: 'uid123',
      urlExtension: 'jazzysalmon',
      avatar: '',
      link: 'https://github.com/Jappzy',
      postCount: 2,
      likeCount: 14,
      location: 'Philadelphia, PA',
      createdAt: new Date(),
      email: 'hehehaha@gmail.com',
      displayName: 'Alfred Jones',
      provider: 'google',
      bio: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Nemo ducimus quod voluptates expedita incidunt iusto possimus, quidem eaque consequuntur dolore ea delectus vero fugit pariatur, quos distinctio.'
    });

    this.router.navigateByUrl('/');
  }

  logout() {
    this.user$.next(null);
  }
}
