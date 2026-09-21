export interface LoanAiAssessmentResponse {
  recommendation: 'APPROVE' | 'REJECT' | 'REVIEW';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  reasoning: string;
  suggestedMaximumAmount: number;
  confidence: number;
}
