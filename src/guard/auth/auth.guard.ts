import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

import { AngularFireAuth } from 'angularfire2/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {

    return new Promise((resolve, reject) => {
      this.afAuth.auth.onAuthStateChanged(
        (firebaseUser: firebase.User) => {
              if (firebaseUser) {
                resolve(true);
              } else {
                console.log('Usuario no logeado');
                this.router.navigate(['/login']);
                resolve(false);
              }
        },(e) => reject(e));
    });
  }


}