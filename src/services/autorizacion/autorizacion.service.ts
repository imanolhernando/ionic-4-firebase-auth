import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ComponentesService } from '../componentes/componentes.service';
import * as firebase from 'firebase/app';
@Injectable({
  providedIn: 'root'
})
export class AutorizacionService {

  constructor(
    private googlePlus: GooglePlus,
    private angularFireAuth: AngularFireAuth,
    private angularFirestore: AngularFirestore,
    public platform: Platform,
    public componentesService:ComponentesService,
  ) {

  }

  doLogin(value) {
    return new Promise<firebase.default.auth.UserCredential>((resolve, reject) => {
      this.angularFireAuth
      .signInWithEmailAndPassword(value.email, value.password)
      .then(res =>{
          resolve(res);
        })
      .catch(err => {
          reject(err);
      });
    });
   }

   doLogout() {
    return new Promise<any>((resolve, reject) => {
      if(this.angularFireAuth.currentUser){
        this.angularFireAuth.signOut()
        .then(res =>{
            resolve(res);
          })
        .catch((err) => {
            reject(err);
          });
      }else{
        reject();
      }
    });
   }

   sendPasswordResetEmail(value) {
    return new Promise<any>((resolve, reject) => {
      this.angularFireAuth.useDeviceLanguage();
      this.angularFireAuth
      .sendPasswordResetEmail(value.email)
      .then(res =>{
          resolve(res);
        })
      .catch((err) => {
            reject(err);
        });
    });
   }

   async emailVerificaction() {
      this.angularFireAuth.useDeviceLanguage();
      if(this.angularFireAuth.currentUser){
        (await this.angularFireAuth.currentUser).sendEmailVerification()
        .then( res =>{
            console.log(res)
          })
        .catch((err) => {
            console.log(err)
          });
      }
    }

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.googlePlus.login({}).then((response) => {
          const googleCredential = firebase.default.auth.GoogleAuthProvider.credential(response.idToken);
          firebase.default.auth().signInWithCredential(googleCredential)
          .then((user ) => {
            if(user.additionalUserInfo.isNewUser){
              this.createDoc(user);
            }
            resolve(user);
          });
        }).catch((err) => {
          reject(err);
        });
      }else{
        this.angularFireAuth
        .signInWithPopup(new firebase.default.auth.GoogleAuthProvider())
        .then((user: firebase.default.auth.UserCredential) => {
          if(user.additionalUserInfo.isNewUser){
            this.createDoc(user);
          }
          resolve(user);
        }).catch((err) => {
          reject(err);
        });
      }
    })
  }

createDoc(newUser) {
  return new Promise<any>((resolve, reject) => {
    const email = newUser.user.email;
    return this.angularFirestore.doc(`/usuarios/${newUser.user.uid}`)
      .set({ email })
      .then((data)=>{
        resolve(data);
      }).catch((err)=>{
        console.warn(err)
        reject(err);
      });
  });
}


  doRegister(email: string, password: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
    return this.angularFireAuth
      .createUserWithEmailAndPassword(email, password)
      .then(
        (newUserCredential: firebase.default.auth.UserCredential) => { // TODO buscar modelo firebase.auth.UserCredential
        this.angularFirestore.doc(`/usuarios/${newUserCredential.user.uid}`)
          .set({ email })
          .then(()=>{
            resolve(newUserCredential);
          })
          .catch((err)=>{
            console.warn(err)
            reject(err);
          });
      }).catch((err)=>{
        console.warn(err)
        reject(err);
      });
    });
  }



  currentUser(){
     return this.angularFireAuth.currentUser
   }




   authErrorCode(error) {

    return error.message

    // switch(error.code) {
    //   case 'auth/user-not-found':
    //     return 'Credenciales incorrectas';
    //   case 'auth/wrong-password':
    //     return 'Credenciales incorrectas';
    //   case 'auth/invalid-email':
    //     return 'Email incorrecto';
    //   case 'auth/email-already-in-use':
    //     return 'Ese email se encuentra registado';
    //   case 'auth/weak-password':
    //     return 'Contraseña: 6 caracteres';

    //   default:
    //         return error.message
  // }
}



}


