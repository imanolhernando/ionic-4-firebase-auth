import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { ComponentesService } from '../componentes/componentes.service';
import * as firebase from 'firebase/';
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

  doLogin(value){
    this.componentesService.mostrarCargando();
    return new Promise<any>((resolve, reject) => {
      this.angularFireAuth
      .signInWithEmailAndPassword(value.email, value.password).then(
        res =>{
          this.componentesService.precarga.dismiss();
          resolve(res);
        },err =>{
          this.componentesService.precarga.dismiss();
          reject(err);
        }
      );
    });
   }

   doLogout(){
    return new Promise<any>((resolve, reject) => {
      if(this.angularFireAuth.currentUser){
        this.angularFireAuth.signOut().then(
          res =>{
            resolve(res);
          },err =>{
            reject(err);
        });
      }else{
        reject();
      }
    });
   }

   sendPasswordResetEmail(value){
    this.componentesService.mostrarCargando();
    return new Promise<any>((resolve, reject) => {
      this.angularFireAuth.useDeviceLanguage();
      this.angularFireAuth
      .sendPasswordResetEmail(value.email).then(
        res =>{
          this.componentesService.precarga.dismiss();
          resolve(res);
        },err =>{
          this.componentesService.precarga.dismiss();
          reject(err);
        }
      );
    });
   }

   async emailVerificaction(){
    this.componentesService.mostrarCargando();

      this.angularFireAuth.useDeviceLanguage();
      if(this.angularFireAuth.currentUser){
        (await this.angularFireAuth.currentUser).sendEmailVerification().then(
          res =>{
            this.componentesService.precarga.dismiss();
          },err =>{
            this.componentesService.precarga.dismiss();
          }
        )}
  }

  doGoogleLogin(){
    return new Promise<any>((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.googlePlus.login({}).then((response) => {
          const googleCredential = firebase.default.auth.GoogleAuthProvider.credential(response.idToken);
          firebase.default.auth().signInWithCredential(googleCredential)
          .then((user: any) => {// firebase.auth.UserCredential 
            if(user.additionalUserInfo.isNewUser){
              this.createDoc(user);
            }
            resolve(user);
          });
        },(err) => {
          reject(err);
        });
      }else{
        this.angularFireAuth
        .signInWithPopup(new firebase.default.auth.GoogleAuthProvider())
        .then((user: any) => {// firebase.auth.UserCredential
          if(user.additionalUserInfo.isNewUser){
            this.createDoc(user);
          }
          resolve(user);
        },(err) => {
         reject(err);
       })
      }
    })
  }

createDoc(newUser){
  return new Promise<any>((resolve, reject) => {
    const email = newUser.user.email;
    return this.angularFirestore.doc(`/usuarios/${newUser.user.uid}`)
      .set({ email }).then(
        ()=>{
        resolve();
      }), err=>{
        console.warn(err)
        reject(err);
      };
  });
}


  doRegister(email: string, password: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
    return this.angularFireAuth
      .createUserWithEmailAndPassword(email, password)
      .then(
        (newUserCredential: any) => { // TODO buscar modelo firebase.auth.UserCredential
        this.angularFirestore.doc(`/usuarios/${newUserCredential.user.uid}`)
          .set({ email }).then(
            ()=>{
            resolve(newUserCredential);
          }),err=>{
            console.warn(err)
            reject(err);
          };
      },err =>{
        reject(err);
      });
    });
  }



  currentUser(){
     return this.angularFireAuth.currentUser
   }




   authErrorCode(error) {

    switch(error.code) {
      case 'auth/user-not-found':
        return 'Credenciales incorrectas';
      case 'auth/wrong-password':
        return 'Credenciales incorrectas';
      case 'auth/invalid-email':
        return 'Email incorrecto';
      case 'auth/email-already-in-use':
        return 'Ese email se encuentra registado';
      case 'auth/weak-password':
        return 'Contraseña: 6 caracteres';

      default:
            return error.message
  }}



}


