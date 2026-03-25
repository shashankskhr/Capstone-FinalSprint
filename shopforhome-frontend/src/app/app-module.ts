import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing-module';
import { AppComponent } from './app';

import { AuthInterceptor } from './interceptors/auth-interceptor';

import { NavbarComponent } from './components/navbar/navbar';
import { HomeComponent } from './components/home/home';
import { LoginComponent } from './components/auth/login/login';
import { RegisterComponent } from './components/auth/register/register';
import { ProductListComponent } from './components/product-list/product-list';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { CartComponent } from './components/cart/cart';
import { WishlistComponent } from './components/wishlist/wishlist';
import { CheckoutComponent } from './components/checkout/checkout';
import { OrdersComponent } from './components/orders/orders';
import { AdminDashboardComponent } from './components/admin/admin-dashboard/admin-dashboard';
import { AdminProductsComponent } from './components/admin/admin-products/admin-products';
import { AdminUsersComponent } from './components/admin/admin-users/admin-users';
import { AdminCouponsComponent } from './components/admin/admin-coupons/admin-coupons';
import { AdminReportsComponent } from './components/admin/admin-reports/admin-reports';
import { AdminStockComponent } from './components/admin/admin-stock/admin-stock';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    ProductListComponent,
    ProductDetailComponent,
    CartComponent,
    WishlistComponent,
    CheckoutComponent,
    OrdersComponent,
    AdminDashboardComponent,
    AdminProductsComponent,
    AdminUsersComponent,
    AdminCouponsComponent,
    AdminReportsComponent,
    AdminStockComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }