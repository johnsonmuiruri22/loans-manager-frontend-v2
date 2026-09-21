import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {LoanAiAssessmentResponse} from '../../appUtils/AIUtils/loan-ai-assessment-response';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoanAIAssessmentService {

  private readonly AI_PATH_URL = `${environment.backendUrl}/api/ai`;
  readonly http = inject(HttpClient);

  runLoanAIAssessment(
    loanId: number
  ): Observable<LoanAiAssessmentResponse>{
    return this.http.post<LoanAiAssessmentResponse>(
      `${this.AI_PATH_URL}/loan-assessment/${loanId}`,
      {});
  }

  getAiAssessment(
    loanId: number
  ): Observable<LoanAiAssessmentResponse>{
    return this.http.get<LoanAiAssessmentResponse>(
      `${this.AI_PATH_URL}/loan-assessment/${loanId}`);
  }

}
