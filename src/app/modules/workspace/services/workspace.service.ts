import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { FormGroup } from '@angular/forms';

const API_WORKSPACE_URL = `${environment.apiUrl}/workspaces`;
const API_ANALYSIS_URL = `${environment.apiUrl}/analysis`;

@Injectable({
	providedIn: 'root',
})
export class WorkspaceService {
	constructor(private http: HttpClient) { }

	loadWorkspaces(page: number, pageSize: number, formValue: any): Observable<any> {
		return this.http.post(`${API_WORKSPACE_URL}/load-workspaces?page=${page}&pageSize=${pageSize}`, formValue, { withCredentials: true });
	}

	loadAnalyses(workspace_id: number, page: number, pageSize: number, formValue: any): Observable<any> {
		return this.http.post(`${environment.apiUrl}/analysis/getAnalysesByWorkspaceId/${workspace_id}?page=${page}&pageSize=${pageSize}`, formValue, { withCredentials: true });
	}

	getWorkspaceName(workspace_id: number): Observable<any> {
		return this.http.get(`${API_WORKSPACE_URL}/getWorkspaceName/${workspace_id}`, { withCredentials: true });
	}

	loadAnalysisForEdit(analysis_id: number): Observable<any> {
		return this.http.get(`${API_ANALYSIS_URL}/${analysis_id}`, { withCredentials: true });
	}

	saveEdit(analysis_id: number, data: any): Observable<any> {
		return this.http.put(`${API_ANALYSIS_URL}/${analysis_id}`, data, { withCredentials: true });
	}

	getListPipeline(): Observable<any> {
		return this.http.get(`${environment.apiUrl}/pipelines`, { withCredentials: true });
	}

	getWorkspaceById(workspace_id: number): Observable<any> {
		return this.http.get(`${API_WORKSPACE_URL}/${workspace_id}`, { withCredentials: true });
	}

	deleteWorkspace(workspace_id: number): Observable<any> {
		return this.http.delete(`${API_WORKSPACE_URL}/${workspace_id}`, { withCredentials: true });
	}

	deleteMultipleWorkspaces(ids: number[]): Observable<any> {
		return this.http.delete(`${API_WORKSPACE_URL}/delete-multiple-workspaces`, { withCredentials: true, body: {ids} });
	}

	create(data: any): Observable<any> {
		return this.http.post(`${API_WORKSPACE_URL}`, data, { withCredentials: true });
	}

	edit(id: number, data: any): Observable<any> {
		return this.http.put(`${API_WORKSPACE_URL}/${id}`, data, { withCredentials: true });
	}

	// analysis handler
	deleteAnalysis(analysis_id: number): Observable<any> {
		return this.http.delete(`${API_ANALYSIS_URL}/${analysis_id}`, { withCredentials: true });
	}

	createAnalysis(data: any) {
		return this.http.post(`${API_ANALYSIS_URL}`, data, { withCredentials: true });
	}

	// sample handler
	getSamplesByPipeLine(pipeline: number) {
		return this.http.get(`${environment.apiUrl}/samples/getSamplesByPipeLine/${pipeline}`, { withCredentials: true });
	}
}