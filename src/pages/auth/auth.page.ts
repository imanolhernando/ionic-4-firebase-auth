import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AutorizacionService } from 'src/services/autorizacion/autorizacion.service';
import { ComponentesService } from 'src/services/componentes/componentes.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  link=false;
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
  public signupForm: FormGroup;
  public loading: any;
  public isIgual: boolean;
  public condiciones: boolean;
  public confirm_account: string;
  public error_confirm_account: string;

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
      this.confirm_account = this.translateService.instant('ACCOUNT_CONFIRM'),
        this.error_confirm_account = this.translateService.instant('ACCOUNT_ERROR_CONFIRM')
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
    'deknodesk@gmail.com',
    [Validators.required, Validators.minLength(0), Validators.maxLength(150), Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]
    ],
    password: [
    '123456',
    [Validators.required, Validators.minLength(6), Validators.maxLength(20)]
    ]
    });
    this.signupForm = this.formBuilder.group({
      email: [
        '',
        Validators.compose([Validators.required, Validators.minLength(0), Validators.maxLength(150), Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]),
      ],
      password: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      ],
      confirmPassword: [
        '',
        Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      ],
      termsAccepted: [null, Validators.required],
    }, { validator: this.matchingPasswords('password', 'confirmPassword') });
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
            this.componentesService.presentToast(this.authService.authErrorCode(err));
          })
    }

    tryGoogleLogin(){
      this.authService.doGoogleLogin()
      .then((res) => {
        console.log('tryGoogleLogin',res);
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
              this.authService.emailVerificaction().then(
              ()=> {
                this.componentesService.presentToast(this.ACCOUNT_CONFIRM);
              },error => {
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



    matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
      return (group: FormGroup): { [key: string]: any } => {
        const password = group.controls[passwordKey];
        const confirmPassword = group.controls[confirmPasswordKey];
        this.isIgual = true;

        if (password.value !== confirmPassword.value) {
          this.isIgual = false;
          return {
            mismatchedPasswords: true
          };
        }
      }
    }

    onTermsChecked($event) {
      console.log($event.detail.checked)
      if (!$event.detail.checked) {
        this.signupForm.patchValue({ termsAccepted: null });
      }
    }

    tryRegister(value) {
      this.componentesService.mostrarCargando();
      this.authService.doRegister(value.email, value.password)
        .then(res => {
          this.angularFireAuth.useDeviceLanguage();

          this.authService.emailVerificaction().then(
            () => {
              this.componentesService.presentToast(this.confirm_account);
            }, error => {
              this.componentesService.presentToast(this.error_confirm_account);
            });

        }, error => {
          this.componentesService.presentToast(error);
        });
    }



    toogle() {
      this.link = !this.link;
    }

}
