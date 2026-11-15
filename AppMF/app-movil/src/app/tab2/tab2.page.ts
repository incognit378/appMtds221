import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard,
  IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
  IonList, IonItem, IonLabel, IonButton, IonIcon, IonNote,
  IonListHeader, IonBadge, ToastController
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import {
  trashOutline,
  personOutline,
  checkmarkCircleOutline,
  closeCircleOutline
} from 'ionicons/icons';
import { CarritoService } from '../services/carrito';
import { ApiService } from '../services/api';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonCard,
    IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent,
    IonList, IonItem, IonLabel, IonButton, IonIcon, IonNote,
    IonListHeader, IonBadge
  ]
})
export class Tab2Page implements OnInit {
  esAdmin = false;
  clientes: any[] = [];
  clienteSeleccionado: any = null;

  itemsCarrito: any[] = [];
  total = 0;
  historial: any[] = [];
  enviando = false;

  constructor(
    private carritoService: CarritoService,
    private api: ApiService,
    private toastCtrl: ToastController,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({
      trashOutline,
      personOutline,
      checkmarkCircleOutline,
      closeCircleOutline
    });
  }

  ngOnInit() {
    this.carritoService.carrito$.subscribe(items => {
      this.itemsCarrito = items;
      this.total = this.carritoService.obtenerTotal();
      this.cdr.detectChanges();
    });
    this.verificarRolYCargar();
  }

  ionViewWillEnter() {
    this.verificarRolYCargar();
  }

  verificarRolYCargar() {
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : {};
    this.esAdmin = (user.email || '').trim().toLowerCase() === 'admin@itca.edu.sv';

    this.cargarHistorial();
    if (this.esAdmin) {
      this.cargarClientes();
    }
    this.cdr.detectChanges();
  }

  // --- MÉTODOS ADMINISTRADOR ---
  cargarClientes() {
    this.api.getClientesAdmin().subscribe({
      next: (data: any) => {
        this.clientes = Array.isArray(data) ? data : (data?.data || []);
        if (this.clienteSeleccionado) {
          this.clienteSeleccionado = this.clientes.find(c => c.id === this.clienteSeleccionado.id) || null;
        }
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Error al cargar clientes:', err);
        this.cdr.detectChanges();
      }
    });
  }

  seleccionarCliente(cliente: any) {
    this.clienteSeleccionado = cliente;
    this.cdr.detectChanges();
  }

  async actualizarEstado(solicitudId: number, nuevoEstado: string) {
    this.api.cambiarEstadoSolicitud(solicitudId, nuevoEstado).subscribe({
      next: async () => {
        this.cargarClientes();
        this.cargarHistorial();
        const toast = await this.toastCtrl.create({
          message: `Solicitud #${solicitudId} marcada como ${nuevoEstado}`,
          duration: 2000,
          color: nuevoEstado === 'Aprobada' ? 'success' : 'danger',
          position: 'top'
        });
        await toast.present();
      },
      error: async () => {
        const toast = await this.toastCtrl.create({
          message: 'Error al actualizar el estado',
          duration: 2000,
          color: 'danger',
          position: 'top'
        });
        await toast.present();
      }
    });
  }

  // --- MÉTODOS COMPARTIDOS (CARRITO, HISTORIAL Y CANCELAR) ---
  quitarItem(id: number) {
    this.carritoService.eliminarProducto(id);
  }

  cargarHistorial() {
    this.api.getMisSolicitudes().subscribe({
      next: (data: any) => {
        this.historial = Array.isArray(data) ? data : (data?.data || []);
        this.cdr.detectChanges();
      }
    });
  }

  async cancelarSolicitud(id: number) {
    this.api.cancelarSolicitud(id).subscribe({
      next: async () => {
        this.cargarHistorial();
        if (this.esAdmin) {
          this.cargarClientes();
        }
        const toast = await this.toastCtrl.create({
          message: `Solicitud #${id} cancelada`,
          duration: 2000,
          color: 'warning',
          position: 'top'
        });
        await toast.present();
      },
      error: async (err: any) => {
        const msg = err.error?.message || 'No se pudo cancelar la solicitud';
        const toast = await this.toastCtrl.create({
          message: msg,
          duration: 2500,
          color: 'danger',
          position: 'top'
        });
        await toast.present();
      }
    });
  }

  async enviarSolicitud() {
    if (this.itemsCarrito.length === 0) return;
    this.enviando = true;
    this.cdr.detectChanges();

    this.api.crearSolicitud(this.itemsCarrito, this.total).subscribe({
      next: async () => {
        this.enviando = false;
        this.carritoService.limpiarCarrito();
        this.cargarHistorial();
        if (this.esAdmin) {
          this.cargarClientes();
        }
        this.cdr.detectChanges();
        const toast = await this.toastCtrl.create({
          message: '¡Solicitud registrada exitosamente!',
          duration: 2500,
          color: 'success',
          position: 'top'
        });
        await toast.present();
      },
      error: async () => {
        this.enviando = false;
        this.cdr.detectChanges();
        const toast = await this.toastCtrl.create({
          message: 'Error al registrar la solicitud',
          duration: 2500,
          color: 'danger',
          position: 'top'
        });
        await toast.present();
      }
    });
  }
}