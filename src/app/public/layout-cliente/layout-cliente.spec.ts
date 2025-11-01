import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutCliente } from './layout-cliente';

describe('LayoutCliente', () => {
  let component: LayoutCliente;
  let fixture: ComponentFixture<LayoutCliente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutCliente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutCliente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
