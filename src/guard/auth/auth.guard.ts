import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';

import { AngularFireAuth } from '@angular/fire/auth';
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router,
    private angularFireAuth: AngularFireAuth,
    ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {

    return new Promise((resolve, reject) => {
      this.angularFireAuth.onAuthStateChanged(
        (firebaseUser:  firebase.default.User) => {
              if (firebaseUser) {
                resolve(true);
              } else {
                console.log('Usuario no logeado');
                this.router.navigate(['/']);
                resolve(false);
              }
        },(e) => reject(e));
    });
  }


}