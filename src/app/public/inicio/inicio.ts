import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // <-- Para el botón

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [RouterModule], // <-- Añadir
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio { }
