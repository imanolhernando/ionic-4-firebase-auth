import { Component } from '@angular/core';
import { ComponentesService } from 'src/services/componentes/componentes.service';
import { AutorizacionService } from 'src/services/autorizacion/autorizacion.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
user;
  constructor(
    private authService: AutorizacionService,
    private componentesService:ComponentesService,
    private router: Router,
    ){
      this.user=this.authService.currentUser().email;
    }

  

  ngOnInit() {
  }

  tryLogout(){
    this.authService.doLogout().then(
    () => {
      this.router.navigate(['/login']);
    },(e) => {
      console.log("Logout error", e);
    })
  }
}
