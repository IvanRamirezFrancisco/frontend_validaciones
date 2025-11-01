import { TestBed } from '@angular/core/testing';

// 1. Importa el nombre de clase correcto
import { InventarioService } from './inventario';

// 2. Describe el servicio correcto
describe('InventarioService', () => { 
  // 3. Define la variable con el tipo correcto
  let service: InventarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    // 4. Inyecta el servicio correcto
    service = TestBed.inject(InventarioService); 
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});