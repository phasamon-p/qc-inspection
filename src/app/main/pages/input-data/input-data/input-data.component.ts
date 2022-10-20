import { Component, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

import * as snippet from 'app/main/forms/form-validation/form-validation.snippetcode';

import { PalletService } from 'app/auth/service';

@Component({
  selector: 'app-input-data',
  templateUrl: './input-data.component.html',
  styleUrls: ['./input-data.component.scss']
})
export class InputDataComponent implements OnInit {
  // public
  public contentHeader: object;
  public _snippetCodeReactiveForms = snippet.snippetCodeReactiveForms;

  public ReactiveUserDetailsForm: UntypedFormGroup;
  public ReactiveUDFormSubmitted = false;

  public palletCode: Array<any>;
  // valiables about date
  public date;
  public ngbDateStruct;

  // Reactive User Details form data
  public UDForm = {
    rejectpallet: '',
    palletnumber: '',
    palletquantity: '',
    grade: '',
    jobnumber: '',
    jobname: '',
    jobquantity: '',
    fnumber: '',
    delta: '',
    checker: '',
    remark: '',

    date: '',
    waste: '',
    batch: '',
    black: '',
    inspectquantity: '',
    color: '',
    acceptedquantity: '',
    white: '',
    rejectedquantity: '',
    measure: '',
    pickout: '',
    markerror: ''
  };
  /**
  *
  * @param {HttpClient} _http
  * @param {PalletService} _palletService
  */

  constructor(
    private formBuilder: UntypedFormBuilder, 
    private _palletService: PalletService) { }

  // getter for easy access to form fields
  get ReactiveUDForm() {
    return this.ReactiveUserDetailsForm.controls;
  }

  ReactiveUDFormOnSubmit() {
    this.ReactiveUDFormSubmitted = true;

    // stop here if form is invalid
    if (this.ReactiveUserDetailsForm.invalid) {
      return;
    }
    console.log(this.ReactiveUserDetailsForm.value);
    alert('SUCCESS!! :-)\n\n' + JSON.stringify(this.ReactiveUserDetailsForm.value));
  }

  changeRejectPallet(e) {
    if (this.ReactiveUserDetailsForm.value.rejectpallet == 'true') {
      // enabled
      document.getElementById('UDPalletNumber').setAttribute("disabled", "true");
      document.getElementById('UDPalletQuantity').setAttribute("disabled", "true");
      // disabled
      document.getElementById('UDGrade').removeAttribute("disabled");
      // set value
      this.ReactiveUserDetailsForm.controls['palletnumber'].setValue('Reject Pallet');
      this.ReactiveUserDetailsForm.controls['palletquantity'].setValue('0');
      this.ReactiveUserDetailsForm.controls['grade'].setValue('');
    }
    else {
      // disabled
      document.getElementById('UDGrade').setAttribute("disabled", "true");
      // enabled
      document.getElementById('UDPalletNumber').removeAttribute("disabled");
      document.getElementById('UDPalletQuantity').removeAttribute("disabled");
      // set value
      this.ReactiveUserDetailsForm.controls['grade'].setValue('A');
      this.ReactiveUserDetailsForm.controls['palletnumber'].setValue('');
      this.ReactiveUserDetailsForm.controls['palletquantity'].setValue('');
    }
  }

  dateToday(){
    this.date = new Date();
    this.ngbDateStruct = { day: this.date.getUTCDate(), month: this.date.getUTCMonth() + 1, year: this.date.getUTCFullYear()};
  }

  cancelClick(){
    // console.log("Cancel Click");
    this.ReactiveUserDetailsForm.reset();
    this.ReactiveUserDetailsForm.controls['rejectpallet'].setValue('false');
    this.ReactiveUserDetailsForm.controls['grade'].setValue('A');
    this.ReactiveUserDetailsForm.controls['date'].setValue(this.ngbDateStruct);
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    // declare date today
    this.dateToday();
    // Reactive form initialization
    this.ReactiveUserDetailsForm = this.formBuilder.group(
      {
        rejectpallet: ['false'],
        palletnumber: ['', Validators.required],
        palletquantity: ['', Validators.required],
        grade: ['', Validators.required],
        jobnumber: ['', Validators.required],
        jobname: ['', Validators.required],
        jobquantity: ['', Validators.required],
        fnumber: ['', Validators.required],
        delta: ['', Validators.required],
        checker: ['', Validators.required],
        remark: [''],

        date: ['', Validators.required],
        waste: ['', Validators.required],
        batch: ['', Validators.required],
        black: ['', Validators.required],
        inspectquantity: ['', Validators.required],
        color: ['', Validators.required],
        acceptedquantity: ['', Validators.required],
        white: ['', Validators.required],
        rejectedquantity: ['', Validators.required],
        measure: ['', Validators.required],
        pickout: [''],
        markerror: ['', Validators.required],
      }
    );
    // set value to formcontrol
    this.ReactiveUserDetailsForm.controls['grade'].setValue('A');
    this.ReactiveUserDetailsForm.controls['date'].setValue(this.ngbDateStruct);

    // api Pallet Service
    this._palletService.getPalletCode()
      .pipe()
      .subscribe(palletcode => {
        this.palletCode = palletcode.data;
      });

    // content header
    this.contentHeader = {
      headerTitle: 'Form Validation',
      actionButton: true,
      breadcrumb: {
        type: '',
        links: [
          {
            name: 'Home',
            isLink: true,
            link: '/'
          },
          {
            name: 'Forms',
            isLink: true,
            link: '/'
          },
          {
            name: 'Form Validation',
            isLink: false
          }
        ]
      }
    };
  }
}
