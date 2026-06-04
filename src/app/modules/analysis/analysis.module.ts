import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnalysisComponent } from './analysis.component';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { SharedModule } from 'src/app/_metronic/shared/shared.module';
import { NgbAlertModule, NgbDatepickerModule, NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnalysisRoutingModule } from './analysis-routing.module';
import { AnalysisListComponent } from './analysis-list/analysis-list.component';
import { WorkspaceModule } from '../workspace/workspace.module';
import { AnalysisIndexComponent } from './analysis-index/analysis-index.component';
import { VariantListComponent } from './components/variant-list/variant-list.component';
import { AnalysisReportVariantComponent } from './components/analysis-report-variant/analysis-report-variant.component';
import { NgSelect2Module } from 'ng-select2';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { QualityControlComponent } from './components/quality-control/quality-control.component';
import { SafePipe } from './pipes/safe.pipe';
import { DeleteSelectedVariantComponent } from './components/delete-selected-variant/delete-selected-variant.component';
import { AnalysisReportDetailComponent } from './components/analysis-report-detail/analysis-report-detail.component';
import { PatientInformationComponent } from './components/patient-information/patient-information.component';
import { GeneDetailComponent } from './components/gene-detail/gene-detail.component';
import { IgvGenomeBrowserComponent } from './components/igv-genome-browser/igv-genome-browser.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ClinicalSummaryComponent } from './components/clinical-summary/clinical-summary.component';
import { EvidenceScoreModalComponent } from './components/evidence-score-modal/evidence-score-modal.component';

@NgModule({
  declarations: [
    AnalysisComponent,
    AnalysisIndexComponent,
    AnalysisListComponent,
    VariantListComponent,
    AnalysisReportVariantComponent,
    QualityControlComponent,
    SafePipe,
    DeleteSelectedVariantComponent,
    AnalysisReportDetailComponent,
    PatientInformationComponent,
    GeneDetailComponent,
    IgvGenomeBrowserComponent,
    ClinicalSummaryComponent,
    EvidenceScoreModalComponent
  ],
  imports: [
    CommonModule,
    InlineSVGModule,
    SharedModule,
    AnalysisRoutingModule,
    NgbDatepickerModule, 
    NgbAlertModule,
    ReactiveFormsModule,
    WorkspaceModule,
    NgSelect2Module,
    NgbModalModule,
		MatCardModule,
		// MatIconModule,
		MatSelectModule,
		MatListModule,
		MatButtonModule,
		NgSelect2Module,
		MatSliderModule,
		NgbDropdownModule,
		MatProgressSpinnerModule,
    FormsModule,
    TranslateModule,
    NgApexchartsModule
  ]
})
export class AnalysisModule { }
