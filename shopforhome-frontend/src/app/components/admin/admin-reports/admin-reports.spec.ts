import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule }
  from '@angular/common/http/testing';
import { RouterTestingModule }
  from '@angular/router/testing';
import { FormsModule }
  from '@angular/forms';
import { AdminReportsComponent }
  from './admin-reports';

describe('AdminReportsComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        FormsModule
      ],
      declarations: [AdminReportsComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture =
      TestBed.createComponent(
        AdminReportsComponent);
    const component =
      fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});