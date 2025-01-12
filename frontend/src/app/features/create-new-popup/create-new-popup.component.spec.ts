import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewPopupComponent } from './create-new-popup.component';

describe('CreateNewPopupComponent', () => {
  let component: CreateNewPopupComponent;
  let fixture: ComponentFixture<CreateNewPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateNewPopupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNewPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
