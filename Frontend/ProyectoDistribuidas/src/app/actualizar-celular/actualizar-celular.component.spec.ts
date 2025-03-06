import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActualizarCelularComponent } from './actualizar-celular.component';

describe('ActualizarCelularComponent', () => {
  let component: ActualizarCelularComponent;
  let fixture: ComponentFixture<ActualizarCelularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActualizarCelularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActualizarCelularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
