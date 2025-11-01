import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DataInitializer } from './utils/data-initializer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule 
  ],
  templateUrl: './app.html', 
  styleUrl: './app.css'      
})
export class App implements OnInit {
  title = 'casa-musica-frontend';

  ngOnInit(): void {
    // Inicializar datos de ejemplo si no existen
    DataInitializer.initializeIfEmpty();
  }
}