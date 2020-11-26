import { AutorizacionService } from './../../services/autorizacion/autorizacion.service';


import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  private user;

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
      this.router.navigate(['/login']);
    },(e) => {
      console.log('Logout error', e);
    })
  }
}
