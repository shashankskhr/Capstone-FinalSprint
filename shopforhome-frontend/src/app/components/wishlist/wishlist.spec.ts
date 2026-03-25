import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { WishlistComponent } from './wishlist';

describe('WishlistComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [WishlistComponent]
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(WishlistComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});