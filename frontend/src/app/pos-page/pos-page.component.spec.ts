import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PosPageComponent } from './pos-page.component';

describe('PosPageComponent', () => {
  let component: PosPageComponent;
  let fixture: ComponentFixture<PosPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PosPageComponent]
    });
    fixture = TestBed.createComponent(PosPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
