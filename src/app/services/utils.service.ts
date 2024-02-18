import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ModalController, ModalOptions, ToastController, ToastOptions } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

 loadingCtrl = inject(LoadingController);
 toastCtrl = inject(ToastController);
 router = inject(Router);
 modalCtrl = inject(ModalController);

 //================LOADING====================
 loading(){
  return this.loadingCtrl.create({spinner: 'crescent'});
 }

 //=================TOAST=======================
 async presentToast(opts?: ToastOptions) {
  const toast = await this.toastCtrl.create(opts);
  toast.present();
 }


 //============ Navegar a cualquier pagina ==================
 routerLink(url:string){
   return this.router.navigateByUrl(url);
 }


 //================Guardar en el local Storage =======================
 saveInLocalStorage(key: string, value: any){
   return localStorage.setItem(key, JSON.stringify(value));
 }

 //==================Obtener un elmento desde el Local Storage
 getFromLocalStorage(key: string){
    return JSON.parse(localStorage.getItem(key));
 }


}
