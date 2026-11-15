import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    const temaGuardado = localStorage.getItem('tema');
    if (temaGuardado === 'dark') {
      document.body.classList.add('dark-theme');
    }
  }
}