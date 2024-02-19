import { Component, OnInit, inject, AfterViewInit, ElementRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { HttpClient } from '@angular/common/http';
import { ModalController } from '@ionic/angular';
import { TermsAndConditions } from 'src/app/shared/components/terms-and-conditions/terms-and-conditions.component';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; // Importa el plugin de la cámara
import { Geolocation } from '@capacitor/geolocation'; // Importa el plugin de geolocalización
import * as L from 'leaflet'; // Importa Leaflet

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit, AfterViewInit {
  mapElement: ElementRef;
  countries: any[] = [];
  showMap = false; // Agrega una nueva variable para controlar cuándo se muestra el mapa
  http= inject(HttpClient);
  form = new FormGroup({
    uid: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).*$/)
    ]),
    repeatPassword: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    country: new FormControl('', [Validators.required]),
    telf: new FormControl('', [Validators.required, Validators.maxLength(8), Validators.minLength(8)]),
    sex: new FormControl('', [Validators.required]),
    terms: new FormControl(false, Validators.requiredTrue),
    photo: new FormControl('', [Validators.required]), // Agrega un nuevo campo para la foto de perfil
    location: new FormControl('', [Validators.required]), // Agrega un nuevo campo para la ubicación
  }, { validators: this.passwordsMatch })

  //Services
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  constructor(private modalCtrl: ModalController, private el: ElementRef) {}

  ngOnInit() {
    this.http.get('https://restcountries.com/v3.1/all').subscribe((countries: any[]) => {
      this.countries = countries.map(country => country.name.common);
    });
  }

  ngAfterViewInit() {
    this.mapElement = this.el.nativeElement.querySelector('#map');
  }

  passwordsMatch(group: FormGroup) {
    const password = group.get('password').value;
    const repeatPassword = group.get('repeatPassword').value;

    return password === repeatPassword ? null : { notSame: true };
  }

  async takePicture() { // Función para tomar fotos
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });

    this.form.controls.photo.setValue(image.base64String);
  }

  // Función para obtener la ubicación
  async getCurrentLocation() { 
    const coordinates = await Geolocation.getCurrentPosition();
    this.form.controls.location.setValue(JSON.stringify(coordinates.coords));
    this.showMap = true; // Muestra el mapa después de obtener la ubicación
    setTimeout(() => {
      this.showLocationOnMap(coordinates.coords);
      console.log(coordinates.coords);
    });
  }
  
  showLocationOnMap(coords) {
    const map = L.map('map').setView([coords.latitude, coords.longitude], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
    }).addTo(map);
  
    L.marker([coords.latitude, coords.longitude]).addTo(map)
      .bindPopup('Tu ubicación actual')
      .openPopup();
  
    setTimeout(() => {
      map.invalidateSize();
    }, 1000);
  }

  async submit(){
    if(this.form.valid){
      
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.signUp(this.form.value as User).then(async res =>{
        await this.firebaseSvc.updateUser(this.form.value.name);

        let uid = res.user.uid;
        this.form.controls.uid.setValue(uid);
        this.setUserInfo(uid);

      }).catch(error => {

        console.log(error);
        // Enviar toast
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,  
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      }).finally(() =>{
        loading.dismiss();
      })
    }
  }

  async openTermsAndConditions() {
    const modal = await this.modalCtrl.create({
      component: TermsAndConditions
    });
    return await modal.present();
  }

  async setUserInfo(uid:string){
    if(this.form.valid){
      
      const loading = await this.utilsSvc.loading();
      await loading.present();

      let path = `users/${uid}`;
      delete this.form.value.password;
      delete this.form.value.repeatPassword;

      // Parsea la ubicación a JSON antes de guardarla
      const location = JSON.parse(this.form.value.location);

      // Agrega la ubicación al objeto que se va a guardar en la base de datos
      const userData = { ...this.form.value, location };

      this.firebaseSvc.setDocument(path, userData).then(async res =>{
        this.utilsSvc.saveInLocalStorage('user', userData);
        this.utilsSvc.routerLink('/main/home');
        this.form.reset();
      }).catch(error => {

        console.log(error);
        // Enviar toast
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,  
          color: 'primary',
          position: 'middle',
          icon: 'alert-circle-outline'
        })

      }).finally(() =>{
        loading.dismiss();
      })
    }
  }
}
