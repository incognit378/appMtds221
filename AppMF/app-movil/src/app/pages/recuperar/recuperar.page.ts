import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
  IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonCardContent, IonItem, IonLabel, IonInput, IonButton, ToastController
} from '@ionic/angular';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
    IonContent, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonCardContent, IonItem, IonLabel, IonInput, IonButton
  ]
})
export class RecuperarPage {
  email = '';
  codigo = '';
  nuevaPassword = '';
  codigoEnviado = false;
  codigoDemo = '';
  cargando = false;

  constructor(
    private api: ApiService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  async notificar(mensaje: string, color: string) {
    const toast = await this.toastCtrl.create({ message: mensaje, duration: 3000, color, position: 'top' });
    await toast.present();
  }

  enviarCodigo() {
    this.cargando = true;
    this.api.solicitarRecuperacion(this.email).subscribe({
      next: (res) => {
        this.cargando = false;
        this.codigoEnviado = true;
        this.codigoDemo = res.codigo_demo;
        this.notificar(res.message, 'success');
      },
      error: (err) => {
        this.cargando = false;
        this.notificar(err.error?.message || 'Error al verificar correo', 'danger');
      }
    });
  }

  cambiarPassword() {
    this.cargando = true;
    this.api.restablecerPassword({
      email: this.email,
      codigo: this.codigo,
      password: this.nuevaPassword
    }).subscribe({
      next: (res) => {
        this.cargando = false;
        this.notificar(res.message, 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.cargando = false;
        this.notificar(err.error?.message || 'Código inválido', 'danger');
      }
    });
  }
}