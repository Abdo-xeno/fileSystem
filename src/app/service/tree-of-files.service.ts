import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient, HttpHeaders } from '@angular/common/http';


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
    return this.http.get<any[]>(this.backEndUrl + 'tree', this.httpOptions)
  }

  getTreeOfFilesOfDirectory(directory: any): Observable<any[]> {
    return this.http.get<any[]>(this.backEndUrl + 'tree/' + directory, this.httpOptions)
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

  addFileToFolder(directory: any, fileName: any): Observable<any> {
    return this.http.get<any[]>(this.backEndUrl + 'get/' + directory + '/' + fileName,  {
      headers: new HttpHeaders({
        'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*',
      }),
      responseType: 'text' as 'json'
    })
  }

  getFileSize(fileDirectory: any, fileName: any): Observable<any> {
    return this.http.get<any[]>(this.backEndUrl + 'getSize/' + fileDirectory + '/' + fileName,  this.httpOptions)
  }

  getFileContent(fileDirectory: any): Observable<any> {
    return this.http.get<any[]>(this.backEndUrl + 'getContent/' + fileDirectory,  this.httpOptions)
  }

  postFile(fileToUpload: any, directory: any): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('fileKey', fileToUpload, fileToUpload.name);
    return this.http.post(this.backEndUrl + 'upload' + directory , formData)
  }

  addDirectory(directory: any, folderName: any): Observable<any[]> {
    return this.http.get<any[]>(this.backEndUrl + 'addFolder/' + directory + '/' + folderName, this.httpOptions)
  }

  isFile(path: any):  Observable<any[]> {
    return this.http.get<any[]>(this.backEndUrl + 'isFile/' + path, this.httpOptions)
  }

  addFileToDirectory(directory: any, file: any): Observable<any[]> {
    return this.http.get<any[]>(this.backEndUrl + 'addFile/' + directory + '/' + file, this.httpOptions)
  }

  addLink(directory: any, target: any): Observable<any[]> {
    return this.http.get<any[]>(this.backEndUrl + 'addLink/' + directory + '/' + target, this.httpOptions)
  }



}
