import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth, User } from 'firebase/app';
import { switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: BehaviorSubject<any> = new BehaviorSubject(null);
  uid: string;

  constructor(
    private router: Router,
    private fireAuth: AngularFireAuth,
    private fireStore: AngularFirestore
  ) {
    this.fireAuth.authState.pipe(
      switchMap((user: User) =>
        user
        ? this.fireStore.doc(`users/${user.uid}`).valueChanges()
        : of(null)
      )
    )
    .subscribe((user: any) => {
      console.log('User', user);
      this.uid = user && user.uid || null;
      this.user$.next(user);
    });
  }

  async googleLogin() {
    const provider = new auth.GoogleAuthProvider();

    // if popup fails try redirect
    try {
      await this.fireAuth.auth.signInWithPopup(provider);
    } catch (e) {
      if (e && e.code !== 'auth/popup-closed-by-user') {
        await this.fireAuth.auth.signInWithRedirect(provider);
      }
    }

    await this.router.navigateByUrl('/');
  }

  async appleLogin() {
    // Coming Soon!
  }

  async logout() {
    await this.fireAuth.auth.signOut();
    await this.router.navigateByUrl('/');
  }
}
