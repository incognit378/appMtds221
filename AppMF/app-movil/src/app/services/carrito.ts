import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private items: any[] = [];
  private carritoSubject = new BehaviorSubject<any[]>([]);
  carrito$ = this.carritoSubject.asObservable();

  agregarProducto(producto: any) {
    const existente = this.items.find(item => item.id === producto.id);
    if (existente) {
      existente.cantidad += 1;
    } else {
      this.items.push({ ...producto, cantidad: 1 });
    }
    this.carritoSubject.next([...this.items]);
  }

  eliminarProducto(id: number) {
    this.items = this.items.filter(item => item.id !== id);
    this.carritoSubject.next([...this.items]);
  }

  limpiarCarrito() {
    this.items = [];
    this.carritoSubject.next([]);
  }

  obtenerItems() {
    return [...this.items];
  }

  obtenerTotal(): number {
    return this.items.reduce((acc, item) => acc + (Number(item.precio) * item.cantidad), 0);
  }

  obtenerCantidadTotal(): number {
    return this.items.reduce((acc, item) => acc + item.cantidad, 0);
  }
}