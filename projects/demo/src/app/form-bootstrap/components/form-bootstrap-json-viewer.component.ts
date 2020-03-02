import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FlexyFormData, FlexyFormLayoutJson } from '@ng-flexy/form';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { FlexySessionStorageService } from '@ng-flexy/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

const VIEWER_STORAGE_NAME = 'FBJ-Viewer-data';

@Component({
  selector: 'demo-form-json-viewer',
  templateUrl: './form-bootstrap-json-viewer.component.html'
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoFormBootstrapJsonViewerComponent implements OnInit, OnDestroy {
  title: string;
  description: string;
  json: FlexyFormLayoutJson;
  data: FlexyFormData;

  jsonControl = new FormControl('{}');
  dataControl = new FormControl('{}');

  @ViewChild('formWebPreviewModalTemplate', { static: false }) formWebPreviewModal: TemplateRef<any>;
  modalRef: BsModalRef;
  showModal = false;

  private _jsonSubscription: Subscription;
  private _dataSubscription: Subscription;

  constructor(private cdr: ChangeDetectorRef, private storage: FlexySessionStorageService, private modalService: BsModalService) {}

  ngOnInit(): void {
    this._initData();
    this._jsonSubscription = this.jsonControl.valueChanges.subscribe(el => {
      this._saveData();
    });
    this._dataSubscription = this.dataControl.valueChanges.subscribe(el => {
      this._saveData();
    });
  }

  ngOnDestroy(): void {
    if (this._jsonSubscription) {
      this._jsonSubscription.unsubscribe();
    }
    if (this._dataSubscription) {
      this._dataSubscription.unsubscribe();
    }
  }

  reload() {
    this.json = null;
    this.cdr.detectChanges();
    this.json = JSON.parse(this.jsonControl.value);
    this.data = JSON.parse(this.dataControl.value);
    this.cdr.detectChanges();
  }

  onSaved(data: FlexyFormData) {
    this.dataControl.setValue(JSON.stringify(data));
    this.cdr.detectChanges();
  }

  initModal() {
    this.showModal = true;
    this.modalRef = this.modalService.show(this.formWebPreviewModal);
  }

  _saveData() {
    this.storage.setData(VIEWER_STORAGE_NAME, { json: this.jsonControl.value, data: this.dataControl.value });
  }

  _initData() {
    const data = this.storage.getData(VIEWER_STORAGE_NAME);
    if (data) {
      if (data.json) {
        this.jsonControl.setValue(data.json);
        this.json = JSON.parse(this.jsonControl.value);
      }
      if (data.data) {
        this.dataControl.setValue(data.data);
        this.data = JSON.parse(this.dataControl.value);
      }
    }
  }
}
