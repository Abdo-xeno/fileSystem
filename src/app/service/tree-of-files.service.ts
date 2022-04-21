import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TreeOfFilesService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
    })
  };

  backEndUrl = "http://127.0.0.1:8081/get";

  constructor(private http: HttpClient,) { }

  getTreeOfFiles(): Observable<any[]> {
    return this.http.get<any[]>(this.backEndUrl, this.httpOptions)
  }

}
