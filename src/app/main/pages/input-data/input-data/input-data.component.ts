import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

import * as snippet from 'app/main/forms/form-validation/form-validation.snippetcode';
import { NgbDateStruct, NgbCalendar, NgbDate, NgbDateParserFormatter, NgbTimeStruct } from '@ng-bootstrap/ng-bootstrap';

import { FlatpickrOptions } from 'ng2-flatpickr';
import { Person, DataService } from 'app/main/forms/form-elements/select/data.service';
import { pallet_dropdown } from 'app/auth/models';
import { Inject } from '@angular/core';
import { PalletService } from 'app/auth/service';
import { JobNumberService } from 'app/auth/service';
import { User } from 'app/auth/models';
import { AuthenticationService } from 'app/auth/service';
import { Router } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { stringify } from 'querystring';

@Component({
  selector: 'app-input-data',
  templateUrl: './input-data.component.html',
  styleUrls: ['./input-data.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class InputDataComponent implements OnInit {
  // public
  public contentHeader: object;
  public ReactiveUserDetailsForm: UntypedFormGroup;
  public ReactiveUDFormSubmitted = false;
  
  // Data Variable
  public palletCode: Array<any>;
  public jobNumberSelect: Array<any>;
  public selectPalletLoading = false;
  public selectjobNumberLoading = false;
  public fNumber: Array<any>;
  public batchList: Array<any>;

  // valiables about date
  public date;
  public ngbDateStruct;
  public events: string[] = [];
  public basicDPdata: NgbDateStruct;

  public currentUser: User;
  public array: any = [];

  public basicDateOptions: FlatpickrOptions = {
    altInput: true
  };

  // select basic
  

  /**
  *
  * @param {HttpClient} _http
  * @param {PalletService} palletService
  * @param {JobNumberService} jobNumberService
  * @param {AuthenticationService} _authenticationService
  * 
  */

  constructor(
    private formBuilder: UntypedFormBuilder,
    private palletService: PalletService,
    private _authenticationService: AuthenticationService,
    private jobNumberService: JobNumberService,
    ) {
      this._authenticationService.currentUser.subscribe(x => (this.currentUser = x));
     }

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

    let queryParams = this.setData_Add();
    console.log(queryParams);
    this.palletService.addPL(queryParams)
      .pipe()
      .subscribe(Response => {
        let data = Response;
        console.log("responce : " + data);
      }, error => console.log(error));
  }

  changeRejectPallet() {
    if (this.ReactiveUserDetailsForm.value.rejectpallet == 'true') {
      this.cancelClick();
      this.ReactiveUserDetailsForm.controls['rejectpallet'].setValue('true');
      // enabled
      document.getElementById('UDPalletQuantity').setAttribute("disabled", "true");

      // disabled
      document.getElementById('UDGrade').removeAttribute("disabled");

      // set value
      this.ReactiveUserDetailsForm.controls['palletnumber'].disable();
      this.ReactiveUserDetailsForm.controls['palletnumber'].setValue('Reject Pallet');
      this.ReactiveUserDetailsForm.controls['palletquantity'].setValue('0');
      this.ReactiveUserDetailsForm.controls['grade'].reset();
    }
    else {
      this.cancelClick();
      this.ReactiveUserDetailsForm.controls['rejectpallet'].setValue('false');
      // disabled
      document.getElementById('UDGrade').setAttribute("disabled", "true");

      // enabled
      document.getElementById('UDPalletQuantity').removeAttribute("disabled");
      this.ReactiveUserDetailsForm.controls['palletnumber'].enable();

      // set value
      this.ReactiveUserDetailsForm.controls['grade'].setValue('A');
      this.ReactiveUserDetailsForm.controls['palletnumber'].reset();
      this.ReactiveUserDetailsForm.controls['palletquantity'].reset();
    }
  }

  dateToday() {
    this.date = new Date();
    this.ngbDateStruct = { day: this.date.getUTCDate(), month: this.date.getUTCMonth() + 1, year: this.date.getUTCFullYear() };
    this.ReactiveUserDetailsForm.controls['date'].setValue(this.ngbDateStruct);
  }

  dateFormat() {
    return this.ReactiveUserDetailsForm.value.date.year + "-" + this.ReactiveUserDetailsForm.value.date.month + "-" + this.ReactiveUserDetailsForm.value.date.day;
  }

  changDate() {
    let data = this.dateFormat();
    this.palletService.getBatch(this.dateFormat())
      .pipe()
      .subscribe(Response => {
        let data = Response.data;
        // Set Value
        this.batchList = data;
        // console.log(data)
      }, error => console.log(error));
  }

  changBatch() {
    let data = this.dateFormat();
    let batch = this.ReactiveUserDetailsForm.value.batch;
    this.palletService.getBatchDetail(data, batch)
      .pipe()
      .subscribe(Response => {
        let data = Response.data;
        console.log("response : " + JSON.stringify(data));
        // Set Value
        this.ReactiveUserDetailsForm.controls['waste'].setValue(data.waste);
        this.ReactiveUserDetailsForm.controls['black'].setValue(data.black);
        this.ReactiveUserDetailsForm.controls['inspectquantity'].setValue(data.total);
        this.ReactiveUserDetailsForm.controls['color'].setValue(data.color);
        this.ReactiveUserDetailsForm.controls['acceptedquantity'].setValue(data.good);
        this.ReactiveUserDetailsForm.controls['white'].setValue(data.white);
        this.ReactiveUserDetailsForm.controls['rejectedquantity'].setValue(data.bad);
        this.ReactiveUserDetailsForm.controls['measure'].setValue(data.measure);
        this.ReactiveUserDetailsForm.controls['markerror'].setValue(data.markError);
      }, error => console.log(error));
  }

  setData_Add() {
    var x = this.ReactiveUserDetailsForm.value.jobquantity;
    let jobQty = x.toString();

    let queryParams = JSON.stringify({
      "reject_Pallet": "no",
      "pallet_no": this.ReactiveUserDetailsForm.value.palletnumber,
      "pallet_Qty": this.ReactiveUserDetailsForm.value.palletquantity,
      "grade": this.ReactiveUserDetailsForm.value.grade,
      "job_no": this.ReactiveUserDetailsForm.value.jobnumber,
      "job_name": this.ReactiveUserDetailsForm.value.jobname,
      "job_Qty": jobQty,
      "f_Number": this.ReactiveUserDetailsForm.value.fnumber,
      "delta": this.ReactiveUserDetailsForm.value.delta,
      "checkker_name": this.ReactiveUserDetailsForm.value.checker,
      "remark_txt": this.ReactiveUserDetailsForm.value.remark,
      "date_stm": this.dateFormat(),
      "batch_no": this.ReactiveUserDetailsForm.value.batch,
      "inspect_Qty": this.ReactiveUserDetailsForm.value.inspectquantity,
      "appcept_Qty": this.ReactiveUserDetailsForm.value.acceptedquantity,
      "reject_Qty": this.ReactiveUserDetailsForm.value.rejectedquantity,
      "pick_Out": this.ReactiveUserDetailsForm.value.pickout,
      "wasted_": this.ReactiveUserDetailsForm.value.waste,
      "black_": this.ReactiveUserDetailsForm.value.black,
      "colors_": this.ReactiveUserDetailsForm.value.color,
      "white_": this.ReactiveUserDetailsForm.value.white,
      "measure_": this.ReactiveUserDetailsForm.value.measure,
      "mark_err": this.ReactiveUserDetailsForm.value.markerror
    });
    return queryParams;
  }

  cancelClick() {
    // console.log(this.ReactiveUserDetailsForm.value.date);
    this.ReactiveUserDetailsForm.reset();
    this.ReactiveUserDetailsForm.controls['rejectpallet'].setValue('false');
    this.ReactiveUserDetailsForm.controls['grade'].setValue('A');
    this.ReactiveUserDetailsForm.controls['date'].setValue(this.ngbDateStruct)
  }

  changPalletNumber() {
    // api Pallet detail
    this.palletService.getPalletDetail(this.ReactiveUserDetailsForm.value.palletnumber.name)
      .pipe()
      .subscribe(Response => {
        let data = Response.data[0];
        // Set Value
        this.ReactiveUserDetailsForm.controls['palletquantity'].setValue(data.qty);
        this.ReactiveUserDetailsForm.controls['jobnumber'].setValue(data.job_id);
        this.ReactiveUserDetailsForm.controls['jobname'].setValue(data.job_name);
        this.ReactiveUserDetailsForm.controls['jobquantity'].setValue(data.qty);
        this.ReactiveUserDetailsForm.controls['fnumber'].setValue(data.part_name[0]);
        this.ReactiveUserDetailsForm.controls['palletquantity'].setValue(data.qty1);
        this.fNumber = data.part_name;
        this.ReactiveUserDetailsForm.controls['checker'].setValue(this.currentUser.firstName + ' ' +  this.currentUser.lastName );
      });
  }

  changJobNumber(){
    console.log(this.ReactiveUserDetailsForm.value.jobnumber.name);
    this.palletService.getJobNumberDetail(this.ReactiveUserDetailsForm.value.jobnumber.name)
      .pipe()
      .subscribe(Response => {
        let data = Response.data;
        console.log("response : " + JSON.stringify(data));
        // Set Value
        this.ReactiveUserDetailsForm.controls['jobname'].setValue(data.job_name);
        this.ReactiveUserDetailsForm.controls['jobquantity'].setValue(data.qty1);
        this.fNumber = data.part_name;
        this.ReactiveUserDetailsForm.controls['checker'].setValue(this.currentUser.firstName + ' ' +  this.currentUser.lastName );
        console.log(this.ReactiveUserDetailsForm.value);
      }, error => console.log(error));
  }

  /**
   * 
   *  Call Api getJobNumber
   *
   */
  getJobNumber(){
    // api Pallet Service
    this.selectjobNumberLoading = true;
    this.jobNumberService.getJobNumber()
      .pipe()
      .subscribe(responce => {
        let array = [];
        for (let key in responce.data) {
          let p = { name: responce.data[key] }
          array.push(p);
        }
        this.jobNumberSelect = array;
      });
    this.selectjobNumberLoading = false;
  }

  /**
   * 
   *  Call Api getPalletCode
   *
   */
  getPalletNumber(){
    // Api Get Pallet Number
    this.selectPalletLoading = true;
    this.palletService.getPalletCode()
      .pipe()
      .subscribe(palletcode => {
        let array = [];
        for (let key in palletcode.data) {
          let p = { name: palletcode.data[key] }
          array.push(p);
        }
        this.palletCode = array;
      });
    this.selectPalletLoading = false;
  }

  // Lifecycle Hooks
  // -----------------------------------------------------------------------------------------------------

  /**
   * On init
   */
  ngOnInit() {
    // Reactive form initialization
    this.ReactiveUserDetailsForm = this.formBuilder.group(
      {
        rejectpallet: ['false'],
        palletnumber: [{ name: null }, Validators.required],
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
    this.cancelClick();
    this.changeRejectPallet();
    // declare date today
    this.dateToday();
    this.changDate();

    // Api Get Pallet Number
    this.getPalletNumber();

    // Api Get Job Number
    this.getJobNumber();
  
    // set value to formcontrol
    this.ReactiveUserDetailsForm.controls['grade'].setValue('A');
    this.ReactiveUserDetailsForm.controls['date'].setValue(this.ngbDateStruct);

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
