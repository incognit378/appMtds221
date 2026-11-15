import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonIcon, IonBadge, IonSearchbar, IonContent, IonSpinner,
  IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, ToastController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { bagHandleOutline, addOutline } from 'ionicons/icons';
import { ApiService } from '../services/api';
import { CarritoService } from '../services/carrito';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule, RouterModule,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
    IonIcon, IonBadge, IonSearchbar, IonContent, IonSpinner,
    IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent
  ],
})
export class Tab1Page implements OnInit {
  productos: any[] = [];
  productosFiltrados: any[] = [];
  totalItems = 0;
  cargando = true;
  esAdmin = false;

  constructor(
    private api: ApiService,
    private carritoService: CarritoService,
    private toastCtrl: ToastController,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ bagHandleOutline, addOutline });
  }

  ngOnInit() {
    this.verificarRol();
    this.cargarCatalogo();
    this.carritoService.carrito$.subscribe(() => {
      this.totalItems = this.carritoService.obtenerCantidadTotal();
      this.cdr.detectChanges();
    });
  }

  ionViewWillEnter() {
    this.verificarRol();
  }

  verificarRol() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.esAdmin = (user.email || '').trim().toLowerCase() === 'admin@itca.edu.sv';
    this.cdr.detectChanges();
  }

  cargarCatalogo() {
    this.cargando = true;
    this.api.getProductos().subscribe({
      next: (res) => {
        const lista = Array.isArray(res) ? res : (res?.data || []);
        this.productos = lista;
        this.productosFiltrados = lista;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando catálogo:', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  filtrarProductos(event: any) {
    const texto = (event.target.value || '').toLowerCase().trim();
    if (!texto) {
      this.productosFiltrados = [...this.productos];
      this.cdr.detectChanges();
      return;
    }
    this.productosFiltrados = this.productos.filter(p =>
      (p.nombre || '').toLowerCase().includes(texto) ||
      (p.categoria || '').toLowerCase().includes(texto)
    );
    this.cdr.detectChanges();
  }

  async agregarRapido(event: Event, producto: any) {
    event.stopPropagation();
    this.carritoService.agregarProducto(producto);
    const toast = await this.toastCtrl.create({
      message: `Agregado: ${producto.nombre}`,
      duration: 1200,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }
}