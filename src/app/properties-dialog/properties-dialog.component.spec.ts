import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertiesDialog } from './properties-dialog.component';

describe('PropertiesDialog', () => {
  let component: PropertiesDialog;
  let fixture: ComponentFixture<PropertiesDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PropertiesDialog ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertiesDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
