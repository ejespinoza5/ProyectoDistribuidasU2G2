import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCelularComponent } from './crear-celular.component';

describe('CrearCelularComponent', () => {
  let component: CrearCelularComponent;
  let fixture: ComponentFixture<CrearCelularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrearCelularComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearCelularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
