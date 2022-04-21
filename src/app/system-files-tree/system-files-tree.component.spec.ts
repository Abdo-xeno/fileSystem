import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemFilesTreeComponent } from './system-files-tree.component';

describe('SystemFilesTreeComponent', () => {
  let component: SystemFilesTreeComponent;
  let fixture: ComponentFixture<SystemFilesTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemFilesTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemFilesTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
