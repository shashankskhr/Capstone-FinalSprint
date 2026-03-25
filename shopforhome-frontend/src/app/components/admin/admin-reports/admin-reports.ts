import { Component } from '@angular/core';
import { ReportService }
  from '../../../services/report';

@Component({
  selector: 'app-admin-reports',
  standalone: false,
  templateUrl: './admin-reports.html',
  styleUrls:
    ['./admin-reports.scss']
})
export class AdminReportsComponent {

  form = {
    fromDate: '',
    toDate: ''
  };

  report: any = null;
  loading = false;
  error = '';
  generated = false;

  constructor(
    private reportService: ReportService
  ) {}

  generate() {
    this.error = '';
    this.report = null;
    this.generated = false;

    if (!this.form.fromDate) {
      this.error =
        'Please select From Date.';
      return;
    }

    if (!this.form.toDate) {
      this.error =
        'Please select To Date.';
      return;
    }

    if (this.form.fromDate >
        this.form.toDate) {
      this.error =
        'From Date cannot be ' +
        'after To Date.';
      return;
    }

    this.loading = true;

    console.log('Generating report for:',
      this.form);

    this.reportService.getSalesReport(
      this.form
    ).subscribe({
      next: (res: any) => {
        console.log('Report response:', res);
        this.report = res;
        this.generated = true;
        this.loading = false;
      },
      error: (err) => {
        console.log('Report error:', err);
        this.error =
          '❌ Failed to generate report. ' +
          (err.error?.message || '');
        this.loading = false;
      }
    });
  }

  clearReport() {
    this.report = null;
    this.generated = false;
    this.form = {
      fromDate: '',
      toDate: ''
    };
    this.error = '';
  }
}