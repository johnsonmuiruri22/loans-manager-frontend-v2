import {Component, Inject, OnInit} from '@angular/core';
import {MATERIALModule} from '../../../material/material-module';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoanService} from '../../../../SERVICES/LoanService/loan-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoanRequestDetails} from '../../../../appUtils/LoanUtils/loan-request-details';
import {LoanProcessingInfo} from '../../../../appUtils/LoanUtils/loan-processing-info';
import {LoanAiAssessmentResponse} from '../../../../appUtils/AIUtils/loan-ai-assessment-response';
import {LoanAIAssessmentService} from '../../../../SERVICES/AIService/loan-aiassessment-service';
import {CommonModule} from '@angular/common';
import {MatProgressBar} from '@angular/material/progress-bar';

@Component({
  selector: 'app-loan-processing-component',
  imports: [MATERIALModule, FormsModule, ReactiveFormsModule, CommonModule, MatProgressBar],
  templateUrl: './loan-processing-component.html',
  styleUrl: './loan-processing-component.css',
})
export class LoanProcessingComponent implements OnInit{
  loanProcessForm!: FormGroup;

  isLoading = false;

  // AI assessment
  aiAssessment: LoanAiAssessmentResponse | null = null;
  aiLoading = false;
  aiError = false;

  // Loan processing state
  isUnderReview = false;
  isRejected = false;
  isApproved = false;

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<LoanProcessingComponent>,

    @Inject(MAT_DIALOG_DATA)
    public loanRequest: LoanRequestDetails,

    private loanAIAssessmentService: LoanAIAssessmentService
  ){
    this.loanProcessForm = this.fb.group({
      loanId: [
        this.loanRequest.loanId,
        Validators.required
      ],
      loanAmountToIssue: [
        this.loanRequest.loanAmountIssued > 0
          ? this.loanRequest.loanAmountIssued
          : this.loanRequest.loanAmountRequested,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],
      durationInMonths: [
        this.loanRequest.loanDuration,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      interestRate: [
        this.loanRequest.loanInterestRate,
        [
          Validators.required,
          Validators.min(0)
        ]
      ],
      totalAmountToRepay: [
        {
          value:
            (
              this.loanRequest.loanAmountIssued > 0
                ? this.loanRequest.loanAmountIssued
                : this.loanRequest.loanAmountRequested
            ) *
            (
              1 +
              (this.loanRequest.loanInterestRate * this.loanRequest.loanDuration) / 100
            ),
          disabled: true
        },
        Validators.required
      ],
      loanPurpose: [
        this.loanRequest.loanPurpose,
        Validators.required
      ]
    });

    this.loanProcessForm
      .get('loanAmountToIssue')
      ?.valueChanges
      .subscribe(() => {
        this.calculateTotalAmountToRepay();
      });

    this.loanProcessForm
      .get('interestRate')
      ?.valueChanges
      .subscribe(() => {
        this.calculateTotalAmountToRepay();
      });

    this.loanProcessForm
      .get('durationInMonths')
      ?.valueChanges
      .subscribe(() => {
        this.calculateTotalAmountToRepay();
      });
  }

  ngOnInit() {
    this.isUnderReview = this.loanRequest.loanStatus === 'UNDER_REVIEW';
    this.loadAiAssessment();
  }


  onProcess(): void {
    if (this.loanProcessForm.invalid) {
      this.loanProcessForm.markAllAsTouched();
      return;
    }

    const updatedLoanRequest: LoanProcessingInfo = {
      ...this.loanRequest,
      ...this.loanProcessForm.getRawValue()
    };

    this.isLoading = true;
    this.loanService
      .processLoan(updatedLoanRequest)
      .subscribe({

        next: (response) => {
          this.isLoading = false;
          switch (response.loanStatus) {
            case 'APPROVED':
              this.isApproved = true;
              this.snackbar.open(
                response.message,
                'Close',
                { duration: 3000 }
              );
              this.dialogRef.close(true);
              break;
            case 'UNDER_REVIEW':
              this.isUnderReview = true;
              this.snackbar.open(
                response.message,
                'Close',
                { duration: 3000 }
              );
              break;
            case 'REJECTED':
              this.isRejected = true;
              this.snackbar.open(
                response.message,
                'Close',
                { duration: 3000 }
              );
              this.dialogRef.close(true);
              break;

            default:
              this.snackbar.open(
                'Unexpected loan processing status.',
                'Close',
                { duration: 3000 }
              );
              break;
          }
        },

        error: (error: any) => {
          console.error(
            'Loan processing failed',
            error
          );
          this.isLoading = false;
          this.snackbar.open(
            error?.message ??
            'An error occurred while processing the loan.',
            'Close',
            { duration: 3000 }
          );
        }
      });
  }


  onApproveReviewedLoan(): void {
    if (this.loanProcessForm.invalid) {
      this.loanProcessForm.markAllAsTouched();
      return;
    }

    const request: LoanProcessingInfo = {
      ...this.loanRequest,
      ...this.loanProcessForm.getRawValue()
    };

    this.isLoading = true;

    this.loanService
      .approveReviewedLoan(
        this.loanRequest.loanId,
        request
      )
      .subscribe({

        next: (response) => {

          this.isLoading = false;

          this.snackbar.open(
            response.message,
            'Close',
            { duration: 3000 }
          );

          this.dialogRef.close(true);
        },

        error: (error: any) => {

          console.error(
            'Manual loan approval failed',
            error
          );

          this.isLoading = false;

          this.snackbar.open(
            error?.message ??
            'Failed to approve the loan.',
            'Close',
            { duration: 3000 }
          );
        }
      });
  }

  onRejectReviewedLoan(): void {

    this.isLoading = true;

    this.loanService
      .rejectReviewedLoan(
        this.loanRequest.loanId
      )
      .subscribe({

        next: (response) => {

          this.isLoading = false;

          this.snackbar.open(
            response.message,
            'Close',
            { duration: 3000 }
          );

          this.dialogRef.close(true);
        },

        error: (error: any) => {

          console.error(
            'Manual loan rejection failed',
            error
          );

          this.isLoading = false;

          this.snackbar.open(
            error?.message ??
            'Failed to reject the loan.',
            'Close',
            { duration: 3000 }
          );
        }
      });
  }

  get aiRecommendation(): string | null {
    return this.aiAssessment?.recommendation ?? null;
  }

  get aiRisk(): string | null {
    return this.aiAssessment?.riskLevel ?? null;
  }

  get aiReasoning(): string | null {
    return this.aiAssessment?.reasoning ?? null;
  }

  private calculateTotalAmountToRepay(): void {
    const amount = Number(
      this.loanProcessForm.get('loanAmountToIssue')?.value
    ) || 0;

    const interestRate = Number(
      this.loanProcessForm.get('interestRate')?.value
    ) || 0;

    const durationInMonths = Number(
      this.loanProcessForm.get('durationInMonths')?.value
    ) || 0;

    const totalAmount = amount * (1 + (interestRate * durationInMonths) / 100);

    this.loanProcessForm
      .get('totalAmountToRepay')
      ?.setValue(totalAmount, { emitEvent: false });
  }

  //RUNNING THE LOAN AI ASSESSMENT
  runAiAssessment(): void {
    this.aiLoading = true;
    this.aiError = false;

    this.loanAIAssessmentService
      .runLoanAIAssessment(this.loanRequest.loanId)
      .subscribe({
        next: (response) => {
          this.aiAssessment = response;
          this.aiLoading = false;

          this.snackbar.open(
            'AI loan assessment completed successfully',
            'Close',
            { duration: 3000 }
          );
        },

        error: (error) => {
          console.error(
            'AI assessment failed',
            error
          );

          this.aiLoading = false;
          this.aiError = true;

          this.snackbar.open(
            'Unable to complete AI loan assessment',
            'Close',
            { duration: 3000 }
          );
        }
      });
  }


  //RETRIEVE AN EXISTING LOAN AI ASSESSMENT
  loadAiAssessment(): void {
    this.aiLoading = true;
    this.aiError = false;

    this.loanAIAssessmentService
      .getAiAssessment(this.loanRequest.loanId)
      .subscribe({
        next: (response) => {
          this.aiAssessment = response;
          this.aiLoading = false;
        },
        error: (error) => {
          this.aiLoading = false;
          // 404 simply means this loan hasn't been assessed yet.
          if (error.status === 404) {
            this.aiAssessment = null;
            return;
          }

          console.error(
            'Failed to load AI assessment',
            error
          );

          this.aiError = true;
        }
      });
  }

  onCancel(){
    this.dialogRef.close();
  }

  get exceedsAiSuggestedAmount(): boolean {
    if (!this.aiAssessment) {
      return false;
    }

    const amount = Number(
      this.loanProcessForm
        .get('loanAmountToIssue')
        ?.value
    ) || 0;

    return amount >
      this.aiAssessment.suggestedMaximumAmount;
  }
}
