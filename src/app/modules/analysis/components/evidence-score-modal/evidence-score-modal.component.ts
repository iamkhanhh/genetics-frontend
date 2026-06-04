import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-evidence-score-modal',
  templateUrl: './evidence-score-modal.component.html',
})
export class EvidenceScoreModalComponent {
  constructor(public modal: NgbActiveModal) {}
}
