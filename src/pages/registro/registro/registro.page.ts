import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AutorizacionService } from './../../../services/autorizacion/autorizacion.service';
import { Router } from '@angular/router';
import { ComponentesService } from './../../../services/componentes/componentes.service';
import { AngularFireAuth } from 'angularfire2/auth';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  public signupForm: FormGroup;
  public loading: any;
  public isIgual: boolean;
  public condiciones: boolean;
  public confirm_account: string;
  public error_confirm_account: string;
  constructor(
    private componentesService: ComponentesService,
    private authService: AutorizacionService,
    private formBuilder: FormBuilder,
    private router: Router,
    private afAuth: AngularFireAuth,
    private translateService: TranslateService
  ) {

  }

  ngOnInit() {
    this.createForm();
    this.translate();
  }

  translate() {
    this.translateService.get('init').subscribe((text: string) => {
      this.confirm_account = this.translateService.instant('ACCOUNT_CONFIRM'),
        this.error_confirm_account = this.translateService.instant('ACCOUNT_ERROR_CONFIRM')
    });
  }
  createForm() {
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

  matchingPasswords(passwordKey: string, confirmPasswordKey: string) {
    return (group: FormGroup): { [key: string]: any } => {
      let password = group.controls[passwordKey];
      let confirmPassword = group.controls[confirmPasswordKey];
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
        debugger
        this.componentesService.precarga.dismiss();
        this.afAuth.auth.useDeviceLanguage();

        this.authService.emailVerificaction().then(
          () => {
            this.componentesService.presentToast(this.confirm_account);
          }, error => {
            this.componentesService.presentToast(this.error_confirm_account);
          });

      }, error => {
        debugger
        this.componentesService.precarga.dismiss();
        //this.componentesService.presentToast(this.authService.authErrorCode(error));
        this.componentesService.presentToast(error);
      });
  }

}