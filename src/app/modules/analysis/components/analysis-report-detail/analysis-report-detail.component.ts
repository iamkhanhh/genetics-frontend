import { Component, Input, OnChanges, SimpleChanges, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { AnalysisReportDetailService, ReportModel } from '../../services/analysis-report-detail.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-analysis-report-detail',
  templateUrl: './analysis-report-detail.component.html',
})
export class AnalysisReportDetailComponent implements OnChanges, OnDestroy {
  @Input() id: number;

  url: SafeResourceUrl | null = null;
  isLoading = false;
  private report: ReportModel | undefined;
  
  private reportSubscription: Subscription | undefined;

  constructor(
    private analysisReportDetailService: AnalysisReportDetailService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.id && changes.id.currentValue > 0) {
      this.loadReport(changes.id.currentValue);
    } else {
      this.url = null;
      this.report = undefined;
    }
  }

  loadReport(reportId: number): void {
    // Hủy request cũ nếu người dùng đang chuyển nhanh giữa các report
    if (this.reportSubscription) {
      this.reportSubscription.unsubscribe();
    }

    this.isLoading = true;
    this.url = null;
    this.reportSubscription = this.analysisReportDetailService.getReportById(reportId).subscribe(
      (report) => {
        if (!report) {
          return;
        }
        this.isLoading = false;
        this.report = report;
        const fileUrl = report.download_url;
        const viewerUrl = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`;
        this.url = this.sanitizer.bypassSecurityTrustResourceUrl(viewerUrl);
        this.cd.detectChanges();
      },
      () => {
        this.isLoading = false;
        this.toastr.error('Error fetching report.');
        this.url = null;
        this.cd.detectChanges();
      }
    );
  }

  downloadReport(): void {
    if (!this.id || this.id <= 0) return;
    const fileUrl = this.report?.download_url;
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    } else {
      this.toastr.error('Report file URL is not available.');
    }
  }

  ngOnDestroy(): void {
    if (this.reportSubscription) {
      this.reportSubscription.unsubscribe();
    }
  }
}