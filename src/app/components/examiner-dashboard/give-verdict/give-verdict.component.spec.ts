import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GiveVerdictComponent } from './give-verdict.component';

describe('GiveVerdictComponent', () => {
  let component: GiveVerdictComponent;
  let fixture: ComponentFixture<GiveVerdictComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GiveVerdictComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GiveVerdictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
