import { AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FlexyForm, FlexyFormComplexFieldLayoutJsonSchema, FlexyFormFieldLayoutSchema } from '@ng-flexy/form';
import { Subscription } from 'rxjs';
import { FlexyWizardService } from '../services/wizard.service';
import * as jsonata_ from 'jsonata';

const jsonata = jsonata_;

const SCHEMA_COMPONENT_ID_KEY = 'id';

@Component({
  selector: 'flexy-form-wizard',
  templateUrl: './wizard.component.html'
})
export class FlexyFormWizardComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() layoutSchema: FlexyFormFieldLayoutSchema;
  @Input() form: FlexyForm;
  @Input() showPagination = false;
  @Input() jsonSchema: FlexyFormComplexFieldLayoutJsonSchema;

  @ViewChild('slider', { static: false }) slider: any;

  activeTab: string;
  render = true;

  swiper;
  slides;
  currentStep = 0;
  slidesLength;

  currentSlideIndex = 0;
  currentSlideValid;

  valuesSub: Subscription;
  slideOpts = {
    initialSlide: 0,
    speed: 400,
    allowTouchMove: false,
    autoHeight: true
  };

  constructor(private flexyWizardService: FlexyWizardService) {}

  async ngOnInit() {
    console.log(this.form.currentData);
    console.log(this.form);
    this.form.currentData$.subscribe(data => {
      console.log(data);
    });
    // this.setSlideValidity();
    // this.valuesSub = this.layoutSchema.formControl.valueChanges.subscribe(() => {
    //   this.setSlideValidity(this.currentSlideIndex);
    // });
  }

  async ngAfterViewInit() {
    // this.swiper = await this.slider.getSwiper();
  }

  ngOnDestroy() {
    // if (this.valuesSub) {
    // this.valuesSub.unsubscribe();
    // }
  }

  async onSlideDidChange() {
    // this.getCurrentSlideIndex();
    // this.setSlideValidity(this.currentSlideIndex);
  }

  private setSlideValidity(index = 0) {
    this.currentSlideValid = (this.layoutSchema.children[index] as FlexyFormFieldLayoutSchema).formControl.valid;
  }

  async prev() {
    // await this.slider.slidePrev();
    if (!this.currentStep) {
      this.flexyWizardService.fireFinishEvent();
    }
  }

  async next() {
    // await this.slider.slideNext();
    if (this.currentStep === (await this.slider.length()) - 1) {
      this.flexyWizardService.fireFinishEvent();
    }
  }

  // isEnabled(schema) {
  //   let _visibility = true;
  //   if ((schema as FlexyFormFieldLayoutSchema).if && this.form) {
  //     _visibility = this._isEnabled((schema as FlexyFormFieldLayoutSchema).if, this.form.currentData);
  //     ;
  //     // console.log(schema);
  //     // console.log(this.form.currentData);
  //     this.form.currentData$.subscribe(data => {
  //       _visibility = this._isEnabled((schema as FlexyFormFieldLayoutSchema).if, data);
  //       // console.log(data);
  //       // console.log(_visibility);
  //       return true;
  //     });
  //   }
  //   return false;
  // }

  getCurrentSlideIndex() {
    // this.slides = this.swiper.slides;
    // [].forEach.call(this.slides, (slide, index) => {
    //   if (slide.className.includes('swiper-slide-active')) {
    //     this.currentSlideIndex = slide.id;
    //     this.slidesLength = this.slides.length - 1;
    //     this.currentStep = index;
    //   }
    // });
  }
}
