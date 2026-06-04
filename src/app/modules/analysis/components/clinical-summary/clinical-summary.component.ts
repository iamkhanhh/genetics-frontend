import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { AnalysisService } from '../../services/analysis.service';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EvidenceScoreModalComponent } from '../evidence-score-modal/evidence-score-modal.component';

const CONSEQUENCE_LABELS: Record<string, string> = {
  frameshift_variant:           'Frameshift — disrupts protein reading frame',
  stop_gained:                  'Nonsense — premature stop codon',
  stop_lost:                    'Stop-loss — protein extension',
  start_lost:                   'Start-loss — translation initiation disrupted',
  missense_variant:             'Missense — amino acid substitution',
  splice_donor_variant:         'Splice-site donor — affects mRNA splicing',
  splice_acceptor_variant:      'Splice-site acceptor — affects mRNA splicing',
  splice_region_variant:        'Splice-region — near splice site',
  inframe_deletion:             'In-frame deletion — removes amino acids',
  inframe_insertion:            'In-frame insertion — adds amino acids',
  synonymous_variant:           'Synonymous — no amino acid change',
  '5_prime_utr_variant':        "5'UTR — may affect gene expression",
  '3_prime_utr_variant':        "3'UTR — may affect mRNA stability",
  intron_variant:               'Intronic — within non-coding region',
  upstream_gene_variant:        'Upstream — regulatory region',
  downstream_gene_variant:      'Downstream — regulatory region',
  intergenic_variant:           'Intergenic — between genes',
};

export const CLINSIG_CONFIG: Record<
  string,
  { label: string; badgeClass: string; hex: string; shortLabel: string }
> = {
  pathogenic: {
    label: 'Pathogenic',
    shortLabel: 'P',
    badgeClass: 'badge-light-danger',
    hex: '#F1416C',
  },
  'likely pathogenic': {
    label: 'Likely Pathogenic',
    shortLabel: 'LP',
    badgeClass: 'badge-light-warning',
    hex: '#FFC700',
  },
  'uncertain significance': {
    label: 'Uncertain Significance',
    shortLabel: 'VUS',
    badgeClass: 'badge-light-primary',
    hex: '#7239EA',
  },
  'likely benign': {
    label: 'Likely Benign',
    shortLabel: 'LB',
    badgeClass: 'badge-light-info',
    hex: '#009EF7',
  },
  benign: {
    label: 'Benign',
    shortLabel: 'B',
    badgeClass: 'badge-light-success',
    hex: '#50CD89',
  },
  'drug response': {
    label: 'Drug Response',
    shortLabel: 'DR',
    badgeClass: 'badge-light-dark',
    hex: '#6741D9',
  },
};

const CHART_ORDER = [
  'pathogenic',
  'likely pathogenic',
  'uncertain significance',
  'likely benign',
  'benign',
  'drug response',
];

@Component({
  selector: 'app-clinical-summary',
  templateUrl: './clinical-summary.component.html',
  styleUrl: './clinical-summary.component.scss',
})
export class ClinicalSummaryComponent implements OnInit, OnDestroy {
  @Input() id: number;

  isLoading = true;
  hasError = false;

  stats: Record<string, number> = {};
  significantVariants: any[] = [];
  diseaseSuggestions: any[] = [];
  pgxVariants: any[] = [];

  chartOptions: any = null;

  clinsigConfig = CLINSIG_CONFIG;
  chartOrder = CHART_ORDER;

  private subscriptions: Subscription[] = [];

  constructor(
    private analysisService: AnalysisService,
    private cd: ChangeDetectorRef,
    private modalService: NgbModal,
  ) {}

  openEvidenceModal(): void {
    this.modalService.open(EvidenceScoreModalComponent, { size: 'lg', centered: true });
  }

  ngOnInit(): void {
    this.loadSummary();
  }

  loadSummary(): void {
    this.isLoading = true;
    this.hasError = false;

    const sub = this.analysisService
      .getClinicalSummary(this.id)
      .subscribe({
        next: (res: any) => {
          if (res.status === 'success') {
            this.stats = res.data.stats;
            this.significantVariants = res.data.significantVariants;
            this.diseaseSuggestions = res.data.diseaseSuggestions;
            this.pgxVariants = res.data.pgxVariants;
            this.buildChart();
          } else {
            this.hasError = true;
          }
          this.isLoading = false;
          this.cd.detectChanges();
        },
        error: () => {
          this.hasError = true;
          this.isLoading = false;
          this.cd.detectChanges();
        },
      });
    this.subscriptions.push(sub);
  }

  private buildChart(): void {
    const series = CHART_ORDER.map((key) => this.stats[key] || 0);
    const labels = CHART_ORDER.map((key) => CLINSIG_CONFIG[key]?.label ?? key);
    const colors = CHART_ORDER.map((key) => CLINSIG_CONFIG[key]?.hex ?? '#999');

    this.chartOptions = {
      series,
      labels,
      colors,
      chart: {
        type: 'donut',
        height: 300,
        fontFamily: 'inherit',
        toolbar: { show: false },
      },
      plotOptions: {
        pie: {
          donut: {
            size: '65%',
            labels: {
              show: true,
              total: {
                show: true,
                label: 'Total',
                formatter: () => String(this.stats['total'] || 0),
              },
            },
          },
        },
      },
      dataLabels: { enabled: false },
      legend: {
        position: 'bottom',
        fontSize: '12px',
      },
      tooltip: {
        y: {
          formatter: (val: number) => `${val} variants`,
        },
      },
      stroke: { width: 2 },
    };
  }

  getConsequenceLabel(consequence: string): string {
    if (!consequence) return '—';
    const lower = consequence.toLowerCase();
    const primary = lower.split('&')[0].trim();
    return CONSEQUENCE_LABELS[primary] ?? consequence;
  }

  getClinsigConfig(classification: string) {
    return CLINSIG_CONFIG[classification?.toLowerCase()] ?? {
      label: classification,
      shortLabel: '?',
      badgeClass: 'badge-light-secondary',
      hex: '#999',
    };
  }

  formatFrequency(freq: any): string {
    const num = parseFloat(freq);
    if (isNaN(num) || freq === '.' || freq === null) return 'Not reported';
    if (num === 0) return 'Not observed';
    if (num < 0.0001) return '< 0.01%';
    return (num * 100).toFixed(4) + '%';
  }

  getOmimUrl(phenoOmim: string): string {
    if (!phenoOmim) return '#';
    return `https://omim.org/entry/${phenoOmim}`;
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
