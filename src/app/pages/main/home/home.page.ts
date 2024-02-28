import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ImageService } from 'src/app/services/image.service';
import { UtilsService } from 'src/app/services/utils.service';
import * as L from 'leaflet'; // Importa Leaflet


@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user: User;
  segment: string;
  publicaciones = [];
  hide:boolean = true;
  email: string;
  mostrar: boolean = false;

  

  constructor(private firebaseSvc: FirebaseService, private utilsSvc: UtilsService, private imageService: ImageService) {
    this.imageService.getImages().subscribe((images: any[]) => {
      console.log(images);
      this.publicaciones = images.map(image => ({
        imagen: image.urls.small_s3,
        likes: image.likes,
        fecha: image.updated_at,
      }));
    });

   
  }

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    this.email = this.user.email;
  
    const coordinates = history.state.coordinates;
    if (coordinates) {
      this.showLocationOnMap(coordinates);
    }
  }
  

  // Ubicacion 
  // Obtener ubicacon almacenada
  showLocationOnMap(coords) {
    const map = L.map('map').setView([coords.latitude, coords.longitude], 13);
    console.log(coords.latitude, coords.longitude);

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




  editProfile() {
    // Navega a la página de edición de perfil
    this.utilsSvc.routerLink('/main/profile');
  }

  //Cerrar sesion en el home
  signOut(){
    this.firebaseSvc.signOut();
  }

  destruir(){
    this.hide = false;
  }

}

