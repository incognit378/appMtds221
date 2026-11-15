import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard,
  IonCardHeader, IonIcon, IonCardTitle, IonCardSubtitle,
  IonCardContent, IonList, IonItem, IonLabel, IonButton,
  IonBadge, IonGrid, IonRow, IonCol, IonToggle
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  personCircleOutline,
  logOutOutline,
  shieldCheckmarkOutline,
  schoolOutline,
  moonOutline
} from 'ionicons/icons';
import { ApiService } from '../services/api';
import { CarritoService } from '../services/carrito';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard,
    IonCardHeader, IonIcon, IonCardTitle, IonCardSubtitle,
    IonCardContent, IonList, IonItem, IonLabel, IonButton,
    IonBadge, IonGrid, IonRow, IonCol, IonToggle
  ],
})
export class Tab3Page implements OnInit {
  usuario: any = null;
  esAdmin = false;
  modoOscuro = false;
  totalSolicitudes = 0;
  aprobadas = 0;
  pendientes = 0;

  constructor(
    private api: ApiService,
    private carritoService: CarritoService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({
      personCircleOutline,
      logOutOutline,
      shieldCheckmarkOutline,
      schoolOutline,
      moonOutline
    });
    this.modoOscuro = document.body.classList.contains('dark-theme');
    this.cargarDatosUsuario();
  }

  ngOnInit() {
    this.cargarResumen();
  }

  ionViewWillEnter() {
    this.modoOscuro = document.body.classList.contains('dark-theme');
    this.cargarDatosUsuario();
    this.cargarResumen();
  }

  cambiarTema(event: any) {
    this.modoOscuro = event.detail.checked;
    if (this.modoOscuro) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('tema', 'dark');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('tema', 'light');
    }
    this.cdr.detectChanges();
  }

  private cargarDatosUsuario() {
    const userStr = localStorage.getItem('user');
    this.usuario = userStr ? JSON.parse(userStr) : null;
    this.esAdmin = (this.usuario?.email || '').trim().toLowerCase() === 'admin@itca.edu.sv';
  }

  cargarResumen() {
    this.api.getMisSolicitudes().subscribe({
      next: (data: any) => {
        const lista = Array.isArray(data) ? data : (data?.data || []);
        this.totalSolicitudes = lista.length;
        this.aprobadas = lista.filter((s: any) => s.estado === 'Aprobada').length;
        this.pendientes = lista.filter((s: any) => s.estado === 'Pendiente').length;
        this.cdr.detectChanges();
      }
    });
  }

  cerrarSesion() {
    this.api.logout().subscribe({
      next: () => this.limpiarYSalir(),
      error: () => this.limpiarYSalir()
    });
  }

  private limpiarYSalir() {
    this.carritoService.limpiarCarrito();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigate(['/login']);
  }
}