import { Injectable } from '@angular/core';
import { Platform } from '@ionic/angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { AngularFirestore } from 'angularfire2/firestore';
import { ComponentesService } from '../componentes/componentes.service';
import { FirebaseUserModel } from '../../models/firebase.user.model';
import * as firebase from 'firebase/app';
import { environment } from '../../environments/environment';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
@Injectable({
  providedIn: 'root'
})
export class AutorizacionService {

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    public platform: Platform,
    public componentesService:ComponentesService,
    private googlePlus: GooglePlus
  ) { 

  }

  doLogin(value){
    this.componentesService.mostrarCargando();
    return new Promise<any>((resolve, reject) => {
      this.afAuth.auth
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
      if(this.afAuth.auth.currentUser){
        this.afAuth.auth.signOut().then( 
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
      this.afAuth.auth.useDeviceLanguage();
      this.afAuth.auth
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
   
  emailVerificaction(){
    this.componentesService.mostrarCargando();
    return new Promise<any>((resolve, reject) => {
      
      this.afAuth.auth.useDeviceLanguage();
      if(this.afAuth.auth.currentUser){
        this.afAuth.auth.currentUser.sendEmailVerification().then( 
          res =>{
            this.componentesService.precarga.dismiss();
            resolve(res);
          },err =>{
            this.componentesService.precarga.dismiss();
            reject(err);
          }
        )};
      });
  }
    
  doGoogleLogin(){
    return new Promise<any>((resolve, reject) => {
      if (this.platform.is('cordova')) {
        this.googlePlus.login({}).then((response) => {
          const googleCredential = firebase.auth.GoogleAuthProvider.credential(response.idToken);
          firebase.auth().signInWithCredential(googleCredential)
          .then((user: firebase.auth.UserCredential) => {
            if(user.additionalUserInfo.isNewUser){
              this.createDoc(user);
            }
            resolve(user);
          });
        },(err) => {
          reject(err);
        });
      }else{
        this.afAuth.auth
        .signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .then((user: firebase.auth.UserCredential) => {
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
    let email = newUser.user.email;
    return this.afs.doc(`/usuarios/${newUser.user.uid}`)
      .set({ email }).then(
        ()=>{
        resolve();
      }),err=>{
        console.warn(err)
        reject(err);
      }; 
  });
}


  doRegister(email: string, password: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(
        (newUserCredential: firebase.auth.UserCredential) => {
        this.afs
          .doc(`/usuarios/${newUserCredential.user.uid}`)
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
     return this.afAuth.auth.currentUser;
   }


   authErrorCode(error) {
     
    switch(error.code) {  
      case 'auth/user-not-found':  
        return "Credenciales incorrectas"; 
      case 'auth/wrong-password':  
        return "Credenciales incorrectas"; 
      case 'auth/invalid-email':  
        return "Email incorrecto"; 
      case 'auth/email-already-in-use':  
        return "Ese email se encuentra registado"; 
      case 'auth/weak-password':  
        return "Contraseña: 6 caracteres"; 
   
      default:
            return error.message
  }}



}


