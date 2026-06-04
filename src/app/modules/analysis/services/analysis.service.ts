import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const API_ANALYSIS_URL = `${environment.apiUrl}/analysis`;

@Injectable({
  providedIn: 'root'
})
export class AnalysisService {

  constructor(
    private http: HttpClient,
    private socket: Socket
  ) { }

  loadAnalyses(page: number, pageSize: number, formValue: any): Observable<any> {
    return this.http.post(`${environment.apiUrl}/analysis/load-analyses?page=${page}&pageSize=${pageSize}`, formValue, { withCredentials: true });
  }

  getAnalysis(id: number): Observable<any> {
    return this.http.get(`${API_ANALYSIS_URL}/${id}`, { withCredentials: true });
  }

  getQCVCF(id: number): Observable<any> {
    return this.http.get(`${API_ANALYSIS_URL}/get-qc-vcf/${id}`, { withCredentials: true });
  }

  loadPatientInfor(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/patient-information/${id}`, { withCredentials: true });
  }

  savePatientInfor(id: number, data: any): Observable<any> {
    return this.http.put(`${environment.apiUrl}/patient-information/${id}`, data, { withCredentials: true });
  }

  getGeneDetail(geneName: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/analysis/get-gene-detail`, { geneName }, { withCredentials: true });
  }

  getStatusUpdate() {
    return this.socket.fromEvent('analysisStatusUpdate');
  }

  getIgvInfo(id: number): Observable<any> {
    return this.http.get(`${API_ANALYSIS_URL}/igv-info/${id}`, { withCredentials: true });
  }

  getClinicalSummary(id: number): Observable<any> {
    return this.http.get(`${environment.apiUrl}/variants/clinical-summary/${id}`, { withCredentials: true });
  }
}
