import {Component, Inject, OnInit} from '@angular/core';
import {MATERIALModule} from '../../../material/material-module';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {LoanService} from '../../../../SERVICES/LoanService/loan-service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {LoanRequests} from '../../../../appUtils/LoanUtils/LoanRequests';
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

  constructor(
    private fb: FormBuilder,
    private loanService: LoanService,
    private snackbar: MatSnackBar,
    private dialogRef: MatDialogRef<LoanProcessingComponent>,

    @Inject(MAT_DIALOG_DATA)
    public loanRequest: LoanRequests,

    private loanAIAssessmentService: LoanAIAssessmentService
  ) {
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
              this.loanRequest.loanInterestRate / 100
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

    // Listen for loan amount changes
    this.loanProcessForm
      .get('loanAmountToIssue')
      ?.valueChanges
      .subscribe(() => {
        this.calculateTotalAmountToRepay();
      });


    // Listen for interest rate changes
    this.loanProcessForm
      .get('interestRate')
      ?.valueChanges
      .subscribe(() => {
        this.calculateTotalAmountToRepay();
      });
  }

  ngOnInit() {
    this.loadAiAssessment();
  }

  onProcess(): void{
    if (this.loanProcessForm.invalid){
      this.loanProcessForm.markAllAsTouched();
      return;
    }

    const updatedLoanRequest = {
      ...this.loanRequest,
      ...this.loanProcessForm.getRawValue()
    } as LoanProcessingInfo;

    this.isLoading = true;
    this.loanService.processLoan(updatedLoanRequest).subscribe({
      next: (response)=>{
        this.isLoading = false;
        this.snackbar.open(response.message,'Close',{duration: 3000});
        this.dialogRef.close(true);
      },
      error: (error: any)=>{
        console.log(error);
        this.isLoading = false;
        this.snackbar.open(
          'An error occurred while processing the loan. Please try again later.',
          'Close',{duration: 3000});
      }
    });
  }

  private calculateTotalAmountToRepay(): void {
    const amount = Number(
      this.loanProcessForm.get('loanAmountToIssue')?.value
    ) || 0;

    const interestRate = Number(
      this.loanProcessForm.get('interestRate')?.value
    ) || 0;

    const totalAmount = amount * (1 + interestRate / 100);

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
