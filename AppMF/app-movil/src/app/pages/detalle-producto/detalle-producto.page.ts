import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
  IonContent, IonSpinner, IonCard, IonCardHeader, IonBadge,
  IonCardTitle, IonCardSubtitle, IonCardContent, IonChip,
  IonLabel, IonButton, IonIcon, ToastController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cartOutline } from 'ionicons/icons';
import { ApiService } from '../../services/api';
import { CarritoService } from '../../services/carrito';

@Component({
  selector: 'app-detalle-producto',
  templateUrl: './detalle-producto.page.html',
  styleUrls: ['./detalle-producto.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
    IonContent, IonSpinner, IonCard, IonCardHeader, IonBadge,
    IonCardTitle, IonCardSubtitle, IonCardContent, IonChip,
    IonLabel, IonButton, IonIcon
  ]
})
export class DetalleProductoPage implements OnInit {
  producto: any = null;
  cargando = true;

  constructor(
    private route: ActivatedRoute,
    private api: ApiService,
    private carritoService: CarritoService,
    private toastCtrl: ToastController,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ cartOutline });
  }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.api.getProductoDetalle(id).subscribe({
        next: (data) => {
          this.producto = data?.data || data;
          this.cargando = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.cargando = false;
          this.cdr.detectChanges();
        }
      });
    }
  }

  async agregarASolicitud() {
    if (!this.producto) return;
    this.carritoService.agregarProducto(this.producto);
    const toast = await this.toastCtrl.create({
      message: `"${this.producto.nombre}" agregado a tus solicitudes`,
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }
}