import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from 'src/app/services/firebase.service';
import { User } from 'src/app/models/user.model';
import { UtilsService } from 'src/app/services/utils.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  profileForm: FormGroup;
  user: User;

  constructor(
    private fb: FormBuilder,
    private firebaseSvc: FirebaseService,
    private utilsSvc: UtilsService
  ) {
    this.profileForm = this.fb.group({
      photo: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telf: ['', Validators.required],
      name: ['', Validators.required],
      sex: ['', Validators.required],
      country: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.user = this.utilsSvc.getFromLocalStorage('user');
    this.profileForm.patchValue(this.user);
    this.profileForm.controls['email'].disable(); // Deshabilita el campo de correo electrónico
  }

  async takePicture() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt
    });

    this.profileForm.controls['photo'].setValue(image.base64String);
  }

  onSubmit() {
    if (this.profileForm.valid) {
      const updatedUser = { ...this.user, ...this.profileForm.value };
      this.firebaseSvc.setDocument(`users/${this.user.uid}`, updatedUser);
      this.utilsSvc.saveInLocalStorage('user', updatedUser);
      this.utilsSvc.presentToast({
        message: 'Perfil actualizado exitosamente',
        duration: 2000,
        color: 'success',
      });
    }
  }

  signOut() {
    this.firebaseSvc.signOut();
  }
}
