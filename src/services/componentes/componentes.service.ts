import { Injectable } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ToastController, LoadingController } from '@ionic/angular';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ComponentesService {
  precarga:any;
  constructor(
    public toastController: ToastController,
    public modalController:ModalController,
    public loadingCtrl:LoadingController,
    public alertController: AlertController
    ) { }

  async presentToast(msg:string) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 150000,
      position: 'top',
      buttons: [ {
          icon: 'close',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }
 

    async mostrarCargando() {
      this.precarga = await this.loadingCtrl.create({
        //message: '',
        //duration: 2000
      });
      await this.precarga.present();
    }

    async presentModal(ModalPage) {
      const modal = await this.modalController.create({
        component: ModalPage
      });
      return await modal.present();
    }

    async presentAlertConfirm(header, msg, btn1, btn2) {
      const alert = await this.alertController.create({
        header: header,
        message: msg,
        buttons: [
          {
            text: btn1,
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
              console.log('Confirm Cancel: blah');
            }
          }, {
            text: btn2,
            handler: () => {
              console.log('Confirm Okay');
            }
          }
        ]
      });
  
      await alert.present();
    }
}
