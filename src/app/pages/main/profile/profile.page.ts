import { Component, OnInit, inject } from '@angular/core';
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
import { AfterViewInit, ElementRef } from '@angular/core';

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

  
   
  

}