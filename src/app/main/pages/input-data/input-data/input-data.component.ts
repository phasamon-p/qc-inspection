import { Component, OnInit, SimpleChanges } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';

import * as snippet from 'app/main/forms/form-validation/form-validation.snippetcode';
import { Inject } from '@angular/core';
import { PalletService } from 'app/auth/service';
import { TestBed } from '@angular/core/testing';
import { stringify } from 'querystring';

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
  public fNumber: Array<any>;
  public batchList: Array<any>;
  // valiables about date
  public date;
  public ngbDateStruct;
  public events: string[] = [];

  // Reactive User Details form data
  // public UDForm = {
  //   rejectpallet: '',
  //   palletnumber: '',
  //   palletquantity: '',
  //   grade: '',
  //   jobnumber: '',
  //   jobname: '',
  //   jobquantity: '',
  //   fnumber: '',
  //   delta: '',
  //   checker: '',
  //   remark: '',

  //   date: '',
  //   waste: '',
  //   batch: '',
  //   black: '',
  //   inspectquantity: '',
  //   color: '',
  //   acceptedquantity: '',
  //   white: '',
  //   rejectedquantity: '',
  //   measure: '',
  //   pickout: '',
  //   markerror: ''
  // };
  /**
  *
  * @param {HttpClient} _http
  * @param {PalletService} palletService
  */

  constructor(
    private formBuilder: UntypedFormBuilder, 
    private palletService: PalletService) { }

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
      },error => console.log(error));
  }

public changeRejectPallet(e) {
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

  public dateToday(){
    this.date = new Date();
    this.ngbDateStruct = { day: this.date.getUTCDate(), month: this.date.getUTCMonth() + 1, year: this.date.getUTCFullYear()};
    this.ReactiveUserDetailsForm.controls['date'].setValue(this.ngbDateStruct);
  }

  public dateFormat(){
    return this.ReactiveUserDetailsForm.value.date.year + "-" + this.ReactiveUserDetailsForm.value.date.month + "-" + this.ReactiveUserDetailsForm.value.date.day;
  }

  public changDate(){
    let data = this.dateFormat();
    this.palletService.getBatch(this.dateFormat())
      .pipe()
      .subscribe(Response => {
        let data = Response.data;
        // Set Value
        this.batchList = data;
        console.log(Response.msg)
      },error => console.log(error));
  }

  public changBatch(){
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
      },error => console.log(error));
  }

  public setData_Add(){
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
      "mark_err": this.ReactiveUserDetailsForm.value.markerror});
      return queryParams;
  }



  addEvent(type: string, event) {
    this.events.push(`${type}: ${event.value}`);
    console.log(this.events);
  }

  public cancelClick(){
    // console.log(this.ReactiveUserDetailsForm.value.date);
    this.ReactiveUserDetailsForm.reset();
    this.ReactiveUserDetailsForm.controls['rejectpallet'].setValue('false');
    this.ReactiveUserDetailsForm.controls['grade'].setValue('A');
    this.ReactiveUserDetailsForm.controls['date'].setValue(this.ngbDateStruct);
  }

  public changPalletNumber(){
    // api Pallet detail
    this.palletService.getPalletDetail(this.ReactiveUserDetailsForm.value.palletnumber)
      .pipe()
      .subscribe(Response => {
        let data = Response.data[0];
        // this.palletCode = palletcode.data;
        // Set Value
        this.ReactiveUserDetailsForm.controls['palletquantity'].setValue(data.qty);
        this.ReactiveUserDetailsForm.controls['jobnumber'].setValue(data.job_id);
        this.ReactiveUserDetailsForm.controls['jobname'].setValue(data.job_name);
        this.ReactiveUserDetailsForm.controls['jobquantity'].setValue(data.qty);
        this.ReactiveUserDetailsForm.controls['fnumber'].setValue(data.part_name[0]);
        this.ReactiveUserDetailsForm.controls['palletquantity'].setValue(data.qty1);
        this.fNumber = data.part_name;
      });
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
    // declare date today
    this.dateToday();
    this.changDate();
    // set value to formcontrol
    this.ReactiveUserDetailsForm.controls['grade'].setValue('A');
    this.ReactiveUserDetailsForm.controls['date'].setValue(this.ngbDateStruct);

    // api Pallet Service
    this.palletService.getPalletCode()
      .pipe()
      .subscribe(palletcode => {
        this.palletCode = palletcode.data;
        console.log(this.palletCode);
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
