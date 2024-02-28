import { Component, OnInit, inject, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
    mapElement: ElementRef;
  countries: any[] = [];
  showMap = false; // Agrega una nueva variable para controlar cuándo se muestra el mapa
  http= inject(HttpClient);
  

   user: User;
  uID:string;
  form: FormGroup;
  //Services

  constructor(private modalCtrl: ModalController, private el: ElementRef,private fb: FormBuilder,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService) {

      this.form = this.fb.group({
        photo: ['',] ,
        telf: ['',] ,
        name: ['',],
        sex: ['',],
        country: ['',] ,
        location: ['',]
      });
    
  }

  ngOnInit() {
    this.http.get('https://restcountries.com/v3.1/all').subscribe((countries: any[]) => {
      this.countries = countries.map(country => country.name.common);
    });
  
    this.user = this.utilsSvc.getFromLocalStorage('user');
    this.uID = this.user.uid;
    this.form.patchValue(this.user);
  
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

    this.form.controls['photo'].setValue(image.base64String);
  }


  // Obtener ubicacon almacenada
  async getCurrentLocation() { 
    const coordinates = await Geolocation.getCurrentPosition();
    this.form.controls['location'].setValue(JSON.stringify(coordinates.coords));
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

  
  onSubmit() {
    if (this.form.valid) {
      const updatedUser = { ...this.user, ...this.form.value };
      this.firebaseSvc.setDocument(`users/${this.user.uid}`, updatedUser);
      this.utilsSvc.saveInLocalStorage('user', updatedUser);
      
      this.utilsSvc.presentToast({
        message: 'Perfil actualizado exitosamente',
        duration: 2000,
        color: 'success',
      });
      this.utilsSvc.routerLink('/main/home');
      this.utilsSvc.presentToast({
        message: `Te damos la bienvenida ${this.user.name}`,
        duration: 2000,  
        color: 'primary',
        position: 'middle',
        icon: 'person-circle-outline'
      })
      // this.signOut();
    }
  }
  //Cerrar sesion en el home
  signOut(){
    this.firebaseSvc.signOut();
  }
  
   
  

}