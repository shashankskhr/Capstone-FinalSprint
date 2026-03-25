import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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

import { AuthGuard } from './guards/auth-guard';
import { AdminGuard } from './guards/admin-guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'wishlist', component: WishlistComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'orders', component: OrdersComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    canActivate: [AdminGuard],
    children: [
      { path: '', component: AdminDashboardComponent },
      { path: 'products', component: AdminProductsComponent },
      { path: 'users', component: AdminUsersComponent },
      { path: 'coupons', component: AdminCouponsComponent },
      { path: 'reports', component: AdminReportsComponent },
      { path: 'stock', component: AdminStockComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }