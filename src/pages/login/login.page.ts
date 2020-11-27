import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { AutorizacionService } from './../../services/autorizacion/autorizacion.service';
import { Router } from '@angular/router';
import { ComponentesService } from './../../services/componentes/componentes.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AlertController } from '@ionic/angular';
import {TranslateService} from '@ngx-translate/core';
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  ACCOUNT_VERIFICATION:string;
  SEND_EMAIL_VERIFICATION: string;
  CANCEL: string;
  VALID_EMAIL: string;
  EMAIL_VERIFICATION: string;
  ACCEPT: string;
  OK: string;
  ACCOUNT_ERROR_CONFIRM: string;
  ACCOUNT_CONFIRM: string;
  EMAIL: string;

  constructor(
    private authService: AutorizacionService,
    public formBuilder: FormBuilder,
    private router: Router,
    private componentesService:ComponentesService,
    private angularFireAuth: AngularFireAuth,
    public alertController: AlertController,
    private translateService:TranslateService
    ) {
      this.angularFireAuth.authState.subscribe(
        (user) => {
          if (user) {
           // console.error(user)
            this.router.navigate(['/home']);
          } else {
            console.error('NO USER')
          }
        },(error) => {
          console.error('ERROR',error)
        }
      );
    }


  ngOnInit() {
    this.createForm();
    this.translate();
  }
  translate(){
    this.translateService.get('init').subscribe((text:string) => {
        this.ACCOUNT_VERIFICATION = this.translateService.instant('ACCOUNT_VERIFICATION'),
        this.SEND_EMAIL_VERIFICATION= this.translateService.instant('SEND_EMAIL_VERIFICATION'),
        this.CANCEL = this.translateService.instant('CANCEL'),
        this.VALID_EMAIL= this.translateService.instant('VALID_EMAIL'),
        this.EMAIL_VERIFICATION = this.translateService.instant('ACCOUNT_VERIFICATION'),
        this.ACCEPT= this.translateService.instant('ACCEPT'),
        this.OK= this.translateService.instant('OK'),
        this.ACCOUNT_ERROR_CONFIRM = this.translateService.instant('ACCOUNT_ERROR_CONFIRM'),
        this.ACCOUNT_CONFIRM= this.translateService.instant('ACCOUNT_CONFIRM'),
        this.EMAIL= this.translateService.instant('EMAIL')
    });
  }
  createForm() {
    this.loginForm = this.formBuilder.group({
    email: [
    'deknodek@gmail.com',
    [Validators.required, Validators.minLength(0), Validators.maxLength(150), Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]
    ],
    password: [
    '123456',
    [Validators.required, Validators.minLength(6), Validators.maxLength(20)]
    ]
    });
    }

    tryLogin(value){
          this.authService.doLogin(value)
          .then(res => {
            console.log('trylogin',res)
            this.router.navigate(['/home']);
            this.angularFireAuth.currentUser.then(currentUser=> {
              if(currentUser.emailVerified){
                  this.router.navigate(['/home']);
                } else {
                  this.presentAlertConfirmEmailVerificaction();
                }
            });
          }, err => {
            // this.componentesService.precarga.dismiss();
            this.componentesService.presentToast(this.authService.authErrorCode(err));
          })
    }

    tryGoogleLogin(){
      this.authService.doGoogleLogin()
      .then((res) => {
        console.log(res);
        this.router.navigate(['/home']);
      }, (err) => {
        this.componentesService.presentToast(this.authService.authErrorCode(err));
      });
    }


    async presentAlertConfirmEmailVerificaction() {
      const alert = await this.alertController.create({
        header:  this.ACCOUNT_VERIFICATION,
        message: this.ACCOUNT_CONFIRM,
        buttons: [
          {
            text: this.ACCEPT,
            role: 'cancel',
            cssClass: 'secondary'
          }, {
            text: this.SEND_EMAIL_VERIFICATION,
            handler: () => {
              // this.componentesService.mostrarCargando();
              this.authService.emailVerificaction().then(
              ()=> {
                // this.componentesService.precarga.dismiss();
                this.componentesService.presentToast(this.ACCOUNT_CONFIRM);
              },error => {
                // this.componentesService.precarga.dismiss();
                this.componentesService.presentToast(this.ACCOUNT_ERROR_CONFIRM);
              })
            }
          }
        ]
      });
      await alert.present();
    }


    async presentAlertPrompt() {
      const alert = await this.alertController.create({
        header: this.VALID_EMAIL,
        inputs: [
          {
            name: 'email',
            type: 'email',
            placeholder: this.EMAIL
          }
        ],
        buttons: [
          {
            text: this.CANCEL,
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: this.OK,
            handler: (value) => {
              console.log('Confirm Ok',value);
              this.authService.sendPasswordResetEmail(value).then(
                (res)=>{
                  this.componentesService.presentToast(this.ACCOUNT_CONFIRM);
                },(e)=>{
                  this.componentesService.presentToast(this.ACCOUNT_ERROR_CONFIRM);
                })
            }
          }
        ]
      });

      await alert.present();
    }



}
