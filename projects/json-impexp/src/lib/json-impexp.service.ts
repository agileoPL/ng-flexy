import { Injectable } from '@angular/core';
import * as JSZip from 'jszip';

export enum FlexyJsonImportErrorEnum {
  NoFile = 'NO_FILE',
  WrongFormat = 'WRONG_FORMAT'
}

@Injectable()
export class FlexyJsonImpExpService {
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
            reject(FlexyJsonImportErrorEnum.NoFile);
          } else {
            files = target.files;
            Array.from(files).forEach((file, index) => {
              fr = new FileReader();
              fr.onload = e => {
                if (multipleFiles && this.isZip(file.type)) {
                  const jszip = new JSZip();
                  jszip.loadAsync(file, { base64: true }).then(zip =>
                    Promise.all(Object.keys(zip.files).map(filename => zip.files[filename].async('string'))).then(list => {
                      list = list.map(item => {
                        try {
                          const json = JSON.parse(item);
                          if (!this.validateImport(json, validatorCallback)) {
                            this.resetInput(input, fr);
                            reject(FlexyJsonImportErrorEnum.WrongFormat);
                          }
                          return json;
                        } catch (err) {
                          this.resetInput(input, fr);
                          reject(FlexyJsonImportErrorEnum.WrongFormat);
                        }
                      });
                      multipleJson = [...multipleJson, ...list];
                      if (index === target.files.length - 1) {
                        this.resetInput(input, fr);
                        resolve(multipleJson);
                      }
                    })
                  );
                } else {
                  const lines = (e.target as FileReader).result;
                  try {
                    const json = JSON.parse(lines as string);
                    if (!this.validateImport(json, validatorCallback)) {
                      this.resetInput(input, fr);
                      reject(FlexyJsonImportErrorEnum.WrongFormat);
                    } else {
                      if (!multipleFiles) {
                        this.resetInput(input, fr);
                        resolve(json);
                      } else {
                        multipleJson.push(json);
                        if (index === target.files.length - 1) {
                          this.resetInput(input, fr);
                          resolve(multipleJson);
                        }
                      }
                    }
                  } catch (err) {
                    this.resetInput(input, fr);
                    reject(FlexyJsonImportErrorEnum.WrongFormat);
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
    name = name
      ? name
          .toLowerCase()
          .split(' ')
          .join('-')
      : extension;
    const now = new Date();
    const month = `${now.getMonth() + 1}`.padStart(2, '0');
    const day = `${now.getDate()}`.padStart(2, '0');
    const hours = `${now.getHours()}`.padStart(2, '0');
    const minutes = `${now.getMinutes()}`.padStart(2, '0');
    const date = `${month}${day}-${hours}${minutes}`;
    return `${name}-${date}.${extension}`;
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

  private resetInput(input: HTMLInputElement, fileReader: FileReader) {
    input.onchange = null;
    fileReader.onload = null;
  }

  private isZip(type: string): boolean {
    return type && (type.includes('/zip') || type.includes('/x-zip'));
  }
}
