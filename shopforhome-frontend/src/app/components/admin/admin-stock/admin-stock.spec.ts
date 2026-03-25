import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule }
  from '@angular/common/http/testing';
import { RouterTestingModule }
  from '@angular/router/testing';
import { AdminStockComponent }
  from './admin-stock';

describe('AdminStockComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [AdminStockComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture =
      TestBed.createComponent(
        AdminStockComponent);
    const component =
      fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});