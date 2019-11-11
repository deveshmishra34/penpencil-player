import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PenpencilPlayerComponent } from './penpencil-player.component';

describe('PenpencilPlayerComponent', () => {
  let component: PenpencilPlayerComponent;
  let fixture: ComponentFixture<PenpencilPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PenpencilPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PenpencilPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
