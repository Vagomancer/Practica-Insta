import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { ImageService } from 'src/app/services/image.service';
import { UtilsService } from 'src/app/services/utils.service';


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
