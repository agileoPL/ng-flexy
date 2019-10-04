import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FlexySessionStorageService {
  setData(key: string, data: any) {
    sessionStorage.setItem(key, JSON.stringify({ data }));
  }

  getData(key: string): any {
    const data = sessionStorage.getItem(key);
    return data ? JSON.parse(data).data : void 0;
  }
}
