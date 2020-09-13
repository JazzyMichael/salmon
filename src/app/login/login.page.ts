import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SEOService } from '../services/seo.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  userSub: Subscription;

  constructor(
    private auth: AuthService,
    private seo: SEOService,
    private router: Router
  ) { }

  ngOnInit() {
    this.seo.updateTags({
      title: 'Login | Salmon',
      description: 'Sign Up for the greatest Salmon App in 2020,!',
      url: 'https://theartofcookingsalmon/login'
    });

    this.userSub = this.auth.user$.subscribe(user => {
      if (user && user.uid) this.router.navigateByUrl('/tabs');
    });
  }

  ngOnDestroy() {
    this.seo.updateTags({});
    this.userSub.unsubscribe();
  }

  async appleLogin() {
    await this.auth.appleLogin();
  }

  async googleLogin() {
    await this.auth.googleLogin();
  }

}
