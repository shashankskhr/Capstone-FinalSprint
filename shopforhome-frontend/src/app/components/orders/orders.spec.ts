import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrdersComponent } from './orders';

describe('OrdersComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [OrdersComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(OrdersComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});