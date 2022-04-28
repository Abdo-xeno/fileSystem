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
    }),
  };

  backEndUrl = "http://127.0.0.1:8081/";

  constructor(private http: HttpClient,) { }

  getTreeOfFiles(): Observable<any[]> {
    return this.http.get<any[]>(this.backEndUrl + 'test', this.httpOptions)
  }

  getTreeOfFilesOfDirectory(directory: any): Observable<any[]> {
    return this.http.get<any[]>(this.backEndUrl + 'test/' + directory, this.httpOptions)
  }


  getDirectoryPath(): Observable<any[]> {
    return this.http.get<any[]>(this.backEndUrl + 'get', this.httpOptions)
  }


  getFilePath(fileName: any): Observable<any> {
    return this.http.get<any[]>(this.backEndUrl + 'get/' + fileName,  {
      headers: new HttpHeaders({
        'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
      }),
      responseType: 'text' as 'json'
    })
  }

  getFileSize(fileDirectory: any, fileName: any): Observable<any> {
    return this.http.get<any[]>(this.backEndUrl + 'getSize/' + fileDirectory + '/' + fileName,  this.httpOptions)
  }

  

}
