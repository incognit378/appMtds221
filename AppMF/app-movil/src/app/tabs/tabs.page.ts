import { Component, EnvironmentInjector, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { gridOutline, cartOutline, personOutline, peopleOutline } from 'ionicons/icons';
import { CarritoService } from '../services/carrito';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [CommonModule, IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonBadge],
})
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);
  cantidadCarrito = 0;
  esAdmin = false;

  constructor(
    private carritoService: CarritoService,
    private cdr: ChangeDetectorRef
  ) {
    addIcons({ gridOutline, cartOutline, personOutline, peopleOutline });
    this.actualizarEstadoRol();

    this.carritoService.carrito$.subscribe(() => {
      this.cantidadCarrito = this.carritoService.obtenerCantidadTotal();
      this.cdr.detectChanges();
    });
  }

  ionViewWillEnter() {
    this.actualizarEstadoRol();
    this.cdr.detectChanges();
  }

  private actualizarEstadoRol() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.esAdmin = (user.email || '').trim().toLowerCase() === 'admin@itca.edu.sv';
  }
}