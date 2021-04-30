
import { AutorizacionService } from './../../services/autorizacion/autorizacion.service';


import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['../style.scss'],
})
export class HomePage {

  public user;

  constructor(
    private authService: AutorizacionService,
    private router: Router,
    ){
      this.authService.currentUser().then(currentUser=>{
        this.user = currentUser;
      });
    }


  tryLogout(){
    this.authService.doLogout().then(
    () => {
      this.router.navigate(['/']);
    },(e) => {
      console.log('Logout error', e);
    })
  }
}
