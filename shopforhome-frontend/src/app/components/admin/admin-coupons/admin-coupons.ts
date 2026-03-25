import { Component, OnInit } from '@angular/core';
import { CouponService } from '../../../services/coupon';
import { UserService } from '../../../services/user';

@Component({
  selector: 'app-admin-coupons',
  standalone: false,
  templateUrl: './admin-coupons.html',
  styleUrls: ['./admin-coupons.scss']
})
export class AdminCouponsComponent implements OnInit {

  coupons: any[] = [];
  users: any[] = [];
  message = '';
  error = '';

  couponForm = {
    couponCode: '',
    discountPercent: 0,
    expiryDate: ''
  };

  assignForm: {
    couponId: number | null,
    userIds: number[]
  } = {
    couponId: null,
    userIds: []
  };

  constructor(
    private couponService: CouponService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.loadCoupons();
    this.userService.getUsers().subscribe({
      next: (u) => this.users = u,
      error: (err) => console.log('Users error:', err)
    });
  }

  loadCoupons() {
    this.couponService.getAllCoupons().subscribe({
      next: (c) => this.coupons = c,
      error: (err) => console.log('Coupons error:', err)
    });
  }

  createCoupon() {
    this.message = '';
    this.error = '';

    if (!this.couponForm.couponCode.trim()) {
      this.error = 'Coupon code is required.';
      return;
    }

    if (this.couponForm.discountPercent <= 0) {
      this.error = 'Discount percent must be > 0.';
      return;
    }

    this.couponService.createCoupon(
      this.couponForm
    ).subscribe({
      next: () => {
        this.message = '✅ Coupon created successfully!';
        this.couponForm = {
          couponCode: '',
          discountPercent: 0,
          expiryDate: ''
        };
        this.loadCoupons();
      },
      error: (err) => {
        console.log('Create coupon error:', err);
        this.error = err.error?.message ||
          '❌ Failed to create coupon.';
      }
    });
  }

  toggleUser(userId: number, event: any) {
    if (event.target.checked) {
      this.assignForm.userIds.push(userId);
    } else {
      this.assignForm.userIds =
        this.assignForm.userIds
          .filter(id => id !== userId);
    }
  }

  assignCoupon() {
    this.message = '';
    this.error = '';

    if (!this.assignForm.couponId) {
      this.error = 'Please select a coupon.';
      return;
    }

    if (this.assignForm.userIds.length === 0) {
      this.error = 'Please select at least one user.';
      return;
    }

    this.couponService.assignCoupon(
      this.assignForm
    ).subscribe({
      next: () => {
        this.message =
          '✅ Coupon assigned to selected users!';
        this.assignForm = {
          couponId: null,
          userIds: []
        };
      },
      error: (err) => {
        console.log('Assign error:', err);
        this.error = err.error?.message ||
          '❌ Failed to assign coupon.';
      }
    });
  }
}