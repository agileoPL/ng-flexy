import { Injectable } from '@angular/core';
import { FlexyToastsService } from '@ng-flexy/toasts';
import * as JSZip from 'jszip';
import * as momentNs from 'moment';
const moment = momentNs;

@Injectable()
export class FlexyJsonImpExpService {
  constructor(private toastsService: FlexyToastsService) {}

  importFromJson(
    input: HTMLInputElement,
    validatorCallback?: (json: object) => boolean,
    multipleFiles = false
  ): Promise<object | object[]> {
    let files: FileList;
    let fr: FileReader;
    let multipleJson = [];
    if (input) {
      input.value = '';
      input.click();
      return new Promise((resolve, reject) => {
        input.onchange = el => {
          const target = el.target as HTMLInputElement;
          if (!target.files || !target.files[0]) {
            this.toastsService.warning(`Please select a file`);
          } else {
            files = target.files;
            Array.from(files).forEach((file, index) => {
              fr = new FileReader();
              fr.onload = e => {
                if (multipleFiles && file.type === 'application/zip') {
                  const jszip = new JSZip();
                  jszip.loadAsync(file, { base64: true }).then(zip =>
                    Promise.all(Object.keys(zip.files).map(filename => zip.files[filename].async('string'))).then(list => {
                      list = list.map(item => {
                        try {
                          const json = JSON.parse(item);
                          if (!this.validateImport(json, validatorCallback)) {
                            this.toastsService.warning(`Imported file has wrong format`);
                            reject();
                          }
                          return json;
                        } catch (err) {
                          this.toastsService.warning(`Imported file has wrong format`);
                          reject();
                        }
                      });
                      multipleJson = [...multipleJson, ...list];
                      if (index === target.files.length - 1) {
                        input.onchange = null;
                        fr.onload = null;
                        resolve(multipleJson);
                      }
                    })
                  );
                } else {
                  const lines = (e.target as FileReader).result;
                  try {
                    const json = JSON.parse(lines as string);
                    if (!this.validateImport(json, validatorCallback)) {
                      this.toastsService.warning(`Imported file has wrong format`);
                      reject();
                    } else {
                      if (!multipleFiles) {
                        input.onchange = null;
                        fr.onload = null;
                        resolve(json);
                      } else {
                        multipleJson.push(json);
                        if (index === target.files.length - 1) {
                          input.onchange = null;
                          fr.onload = null;
                          resolve(multipleJson);
                        }
                      }
                    }
                  } catch (err) {
                    this.toastsService.warning(`Imported file has wrong format`);
                    reject();
                  }
                }
              };
              fr.readAsText(file);
            });
          }
        };
      });
    }
  }

  exportToJson(name: string, json: object) {
    const filename = this.prepareFileName(name, 'json');
    const jsonStr = JSON.stringify(json);
    this.downloadFile(filename, 'data:text/plain;charset=utf-8,', encodeURIComponent(jsonStr));
  }

  exportToJsonZip(zipName: string, namePath: string, multipleJson: object[]) {
    const filename = this.prepareFileName(zipName, 'zip');
    const jszip = new JSZip();
    multipleJson.forEach((el, index) =>
      jszip.file(this.prepareFileName(`${index + 1}-${namePath ? el[namePath] : 'json'}`, 'json'), JSON.stringify(el))
    );
    jszip.generateAsync({ type: 'base64' }).then(content => this.downloadFile(filename, 'data:application/zip;base64,', content));
  }

  private prepareFileName(name: string, extension: string): string {
    return (
      (name
        ? name
            .toLowerCase()
            .split(' ')
            .join('-')
        : extension) +
      '-' +
      moment().format('MMDD-HHmm') +
      '.' +
      extension
    );
  }

  private downloadFile(name: string, dataType: string, data) {
    const element = document.createElement('a');
    element.setAttribute('href', dataType + data);
    element.setAttribute('download', name);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  private validateImport(json, validatorCallback?: (json: object) => boolean): boolean {
    let isValid = false;
    if (validatorCallback) {
      isValid = json && validatorCallback(json);
    } else {
      isValid = json && (Array.isArray(json) || typeof json === 'object');
    }
    return isValid;
  }
}
