import { ChangeDetectorRef, Component } from '@angular/core';
import { AnalysisService } from '../services/analysis.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

type Tabs =
	| 'quality_control'
	| 'variant_list'
	| 'variant_report'
	| 'patient_information'
	| 'clinical_summary';

const BASIC_RESTRICTED_TABS: Tabs[] = ['quality_control', 'variant_report'];
const PLAN_KEY = 'current_subscription_plan';

@Component({
	selector: 'app-analysis-index',
	templateUrl: './analysis-index.component.html',
	styleUrl: './analysis-index.component.scss'
})
export class AnalysisIndexComponent {
	analysis_name = 'Analysis Name';
	id: number;
	isLoaded: boolean;
	type: string;
	project_id: number;
	activeTab: Tabs = 'variant_list';
	isBasicPlan: boolean = true; 
	isAdmin: boolean = false;


	constructor(
		public analysisService: AnalysisService,
		private route: ActivatedRoute,
		private _location: Location,
		private cd: ChangeDetectorRef,
		private authService: AuthService
	) {}

	ngOnInit(): void {
		this.isAdmin = this.authService.currentUserValue?.role == 'Admin';
		this.id = this.route.snapshot.params.id;
		this.isLoaded = false;
		this.loadPlan();
		this.getAnalysisName();
		
	}
	private loadPlan(): void {
		const stored = localStorage.getItem(PLAN_KEY);
		if (!stored) {
			this.isBasicPlan = true;
			return;
		}
		const plan = JSON.parse(stored);
		this.isBasicPlan = plan.planType === 'BASIC';
	}


	getAnalysisName() {
		this.analysisService.getAnalysis(this.id)
			.subscribe((res: any) => {
				if (res.status == 'success') {
					this.project_id = res.data.project_id;
					this.analysis_name = res.data.name;
					this.type = res.data.type;
				}
				this.isLoaded = true;
				this.cd.detectChanges();
			})
	}

	setTab(tab: Tabs) {
		if (this.isBasicPlan && !this.isAdmin && BASIC_RESTRICTED_TABS.includes(tab)) return;
		this.activeTab = tab;
	}

	activeClass(tab: Tabs) {
		return tab === this.activeTab ? 'show active' : '';
	}

	backClicked() {
		this._location.back();
	}
}