import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  baseUrl = "http://localhost:5004"
  constructor(private http: HttpClient) { }

  public InserRecord(data): Observable<any> {
    var url = this.baseUrl + '/insertRecord/';
    var record = new FormData();
    record.append('data', JSON.stringify(data))
    console.log("post")
    return this.http.post(url, record);
  }
  public getAllRecords(): Observable<any> {
    var url = this.baseUrl + '/getAllRecords/'
    return this.http.get(url);
  }

  public deleteRecord(data): Observable<any> {
    var url = this.baseUrl + '/deleteRecord/';
    var record = new FormData();
    record.append('data', JSON.stringify(data))
    return this.http.post(url, record);
  }
  public updateRecord(data): Observable<any> {
    var url = this.baseUrl + '/updateRecord/';
    var record = new FormData();
    record.append('data', JSON.stringify(data))
    return this.http.post(url, record);
  }

}
