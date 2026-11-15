import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonIcon,
  IonCard, IonCardContent, IonItem, IonLabel, IonInput,
  IonText, IonButton, IonSpinner, ToastController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { schoolOutline } from 'ionicons/icons';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonIcon,
    IonCard, IonCardContent, IonItem, IonLabel, IonInput,
    IonText, IonButton, IonSpinner
  ]
})
export class LoginPage {
  loginForm: FormGroup;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private router: Router,
    private toastCtrl: ToastController
  ) {
    addIcons({ schoolOutline });
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async mostrarToast(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      color: color,
      position: 'top'
    });
    await toast.present();
  }

iniciarSesion() {
    if (this.loginForm.invalid) return;

    this.cargando = true;
    this.api.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.cargando = false;
        localStorage.setItem('token', res.token);
        const usuarioCompleto = {
          ...res.user,
          email: res.user?.email || this.loginForm.value.email
        };
        localStorage.setItem('user', JSON.stringify(usuarioCompleto));
        this.mostrarToast(`¡Bienvenido, ${usuarioCompleto.name}!`, 'success');
        this.router.navigate(['/tabs/tab1']);
      },
      error: (err) => {
        this.cargando = false;
        const msg = err.error?.message || 'Credenciales incorrectas o servidor desconectado.';
        this.mostrarToast(msg, 'danger');
      }
    });
  }
}