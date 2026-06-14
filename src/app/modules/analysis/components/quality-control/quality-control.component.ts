import { ChangeDetectorRef, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AnalysisService } from '../../services/analysis.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { PricingService } from 'src/app/pages/pricing/pricing.service';

@Component({
  selector: 'app-quality-control',
  templateUrl: './quality-control.component.html',
  styleUrl: './quality-control.component.scss'
})
export class QualityControlComponent implements OnInit, OnDestroy {
  @Input() id: number;
  @ViewChild('iframe', { static: true }) iframe: ElementRef;
  qcUrl: string = '';
  isLoading: boolean = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private analysisService: AnalysisService,
    private cd: ChangeDetectorRef,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private pricingService: PricingService,
  ) { }

  ngOnInit() {
    this.getVCFQC();
  }

  getVCFQC() {
    this.isLoading = true;

    const sb = this.analysisService.getQCVCF(this.id)
      .subscribe({
        next: (res: any) => {
          if (res.status === "success") {
            this.qcUrl = res.data.replace('http://vg-dev-v2.btgenomics.com/', '/genomics/');
          } else {
            this.toastr.error(res.message);
          }

          setTimeout(() => {
            this.isLoading = false;
            this.cd.detectChanges();
          }, 2000);
        },

        error: (err) => {
          if (err) {
            this.pricingService.fetchCurrentPlan().subscribe({
              next: () => {
                window.location.reload();
              },
              error: (planErr) => {
                console.error('Lỗi khi cập nhật gói cước:', planErr);
              }
            });
          } else {
            this.toastr.error('Có lỗi xảy ra!');
          }

          this.isLoading = false;
          this.cd.detectChanges();
        }
      });

    this.subscriptions.push(sb);
  }

  ngOnDestroy() {
    this.qcUrl = '';
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
