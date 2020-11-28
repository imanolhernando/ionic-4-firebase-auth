import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { AutorizacionService } from '../../services/autorizacion/autorizacion.service';
import { ComponentesService } from '../../services/componentes/componentes.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  link:string;
  loginForm: FormGroup;
  resetPasswordForm: FormGroup;

  signupForm: FormGroup;
  translations;
  isIgual: boolean;

  constructor(
    private activatedRoute: ActivatedRoute,
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
    this.link = this.activatedRoute.snapshot.paramMap.get('link');
    this.createForm();
    this.translate();
  }

    // TRADUCCIONES
    translate() {
      this.translateService.get(
         ['ACCOUNT_CONFIRM',
         'ACCOUNT_ERROR_CONFIRM',
         'ACCOUNT_VERIFICATION',
         'SEND_EMAIL_VERIFICATION',
          'CANCEL',
         'VALID_EMAIL',
         'ACCOUNT_VERIFICATION',
         'ACCEPT',
         'OK',
        'ACCOUNT_CONFIRM',
        'EMAIL',
        ])
      .subscribe((translations) => {
        this.translations = translations;
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

    this.resetPasswordForm = this.formBuilder.group({
      email: [
      '',
      [Validators.required, Validators.minLength(0), Validators.maxLength(150), Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]
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
      // termsAccepted: [null, Validators.required],
    }, {
      validator: this.matchingPasswords('password', 'confirmPassword')
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
          }).catch(e=>{
            console.warn(e);
              this.componentesService.presentToast(this.authService.authErrorCode(e));
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
        header:  this.translations.ACCOUNT_VERIFICATION,
        message: this.translations.ACCOUNT_CONFIRM,
        buttons: [
          {
            text: this.translations.ACCEPT,
            role: 'cancel',
            cssClass: 'secondary'
          }, {
            text: this.translations.SEND_EMAIL_VERIFICATION,
            handler: () => {
              this.authService.emailVerificaction().then(
              ()=> {
                this.componentesService.presentToast(this.translations.ACCOUNT_CONFIRM);
              },error => {
                this.componentesService.presentToast(this.translations.ACCOUNT_ERROR_CONFIRM);
              })
            }
          }
        ]
      });
      await alert.present();
    }

    tryresetPassword(value){
    this.authService.sendPasswordResetEmail(value).then(
      (res)=>{
        this.componentesService.presentToast(this.translations.ACCOUNT_CONFIRM);
      },(e)=>{
        this.componentesService.presentToast(this.translations.ACCOUNT_ERROR_CONFIRM);
      })
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
      this.authService.doRegister(value.email, value.password)
        .then(res => {
          this.angularFireAuth.useDeviceLanguage();

          this.authService.emailVerificaction().then(
            () => {
              this.componentesService.presentToast(this.translations.ACCOUNT_CONFIRM);
            }, error => {
              this.componentesService.presentToast(this.translations.ACCOUNT_ERROR_CONFIRM);
            });

        }, error => {
          this.componentesService.presentToast(error);
        });
    }



    toogle(value) {
      this.link = value;
    }

}
