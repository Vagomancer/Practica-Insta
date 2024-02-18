import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  user: User;

  constructor(private firebaseSvc: FirebaseService, private utilsSvc: UtilsService) {}

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
  }

  editProfile() {
    // Navega a la página de edición de perfil
    this.utilsSvc.routerLink('/main/profile');
  }

  //Cerrar sesion en el home
  signOut(){
    this.firebaseSvc.signOut();
  }

}
