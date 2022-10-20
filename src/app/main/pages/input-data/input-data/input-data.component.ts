import { Component, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

import * as snippet from 'app/main/forms/form-validation/form-validation.snippetcode';
import { MustMatch } from './_helpers/must-match.validator';
import { FlatpickrOptions } from 'ng2-flatpickr';

import { PalletService } from 'app/auth/service';
import { pallet_dropdown } from 'app/auth/models';
import { timingSafeEqual } from 'crypto';

@Component({
  selector: 'app-input-data',
  templateUrl: './input-data.component.html',
  styleUrls: ['./input-data.component.scss']
})
export class InputDataComponent implements OnInit {
  // public
  public contentHeader: object;

  public _snippetCodeTDsimpleValidation = snippet.snippetCodeTDsimpleValidation;
  public _snippetCodeTDMultiRuleValidation = snippet.snippetCodeTDMultiRuleValidation;
  public _snippetCodeInputValidation = snippet.snippetCodeInputValidation;
  public _snippetCodeReactiveForms = snippet.snippetCodeReactiveForms;

  public TDNameVar;
  public TDEmailVar;

  public ReactiveUserDetailsForm: UntypedFormGroup;
  public ReactiveUDFormSubmitted = false;

  public currentRow;
  public palletCode: Array<any>;
  public selectedPalletCode;
  public selectedRejectPallet : boolean = true;

  public cars = [
    { id: 1, name: 'PL220210040' },
    { id: 2, name: 'PL220210041' },
    { id: 3, name: 'PL220210042' },
    { id: 4, name: 'PL220210043' },
  ];

  public birthDateOptions: FlatpickrOptions = {
    altInput: true
  };

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

  constructor(private formBuilder: UntypedFormBuilder, private _palletService: PalletService) {}

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
    if(this.ReactiveUserDetailsForm.value.rejectpallet == 'true'){
      // enabled
      document.getElementById('UDPalletNumber').setAttribute("disabled","true");
      document.getElementById('UDPalletQuantity').setAttribute("disabled","true");
      // disabled
      document.getElementById('UDGrade').removeAttribute("disabled");
    }
    else{
      // disabled
      document.getElementById('UDGrade').setAttribute("disabled","true");
      // enabled
      document.getElementById('UDPalletNumber').removeAttribute("disabled");
      document.getElementById('UDPalletQuantity').removeAttribute("disabled");
    }
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
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
      // ,
      // {
      //   validator: MustMatch('password', 'confPassword')
      // }
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
  }

}
