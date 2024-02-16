import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {
  countries: any[] = [];
  http= inject(HttpClient);
  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*[0-9]).*$/)
    ]),
    repeatPassword: new FormControl('', [Validators.required]),
    name: new FormControl('', [Validators.required, Validators.minLength(4)]),
    country: new FormControl('', [Validators.required]),
    telf: new FormControl('', [Validators.required, Validators.minLength(8)]),
    sex: new FormControl('', [Validators.required]),
  }, { validators: this.passwordsMatch })

  //Services
  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() {
    this.http.get('https://restcountries.com/v3.1/all').subscribe((countries: any[]) => {
      this.countries = countries.map(country => country.name.common);
    });
  }

  passwordsMatch(group: FormGroup) {
    const password = group.get('password').value;
    const repeatPassword = group.get('repeatPassword').value;

    return password === repeatPassword ? null : { notSame: true };
  }

  async submit(){
    if(this.form.valid){
      
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.signUp(this.form.value as User).then(async res =>{
        await this.firebaseSvc.updateUser(this.form.value.name);
        console.log(res)
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
