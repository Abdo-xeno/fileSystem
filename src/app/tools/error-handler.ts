import {
    HttpEvent,
    HttpHandler,
    HttpRequest,
    HttpErrorResponse,
    HttpInterceptor
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { PropertiesDialog } from '../properties-dialog/properties-dialog.component';
@Injectable()
export class ErrorIntercept implements HttpInterceptor {
    constructor(private dialog: MatDialog){}

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(request)
            .pipe(
                retry(1),
                catchError((error: HttpErrorResponse) => {
                    let errorMessage = '';
                    if (error.error instanceof ErrorEvent) {
                    
                        // client-side error
                        errorMessage = `Error: ${error.error.message}`;
                        const dialogRef = this.dialog.open(PropertiesDialog, {
                            data: { error: errorMessage, operation: 'error raised' },
                        });
                        dialogRef.afterClosed().subscribe(result => {
                        });
                    } else {
                        errorMessage = `Error Status: ${error.status}\nMessage: ${error.message}`;
                        const dialogRef = this.dialog.open(PropertiesDialog, {
                            data: { error: errorMessage, operation: 'error raised' },
                        });
                        dialogRef.afterClosed().subscribe(result => {
                        });
                        // server-side error
                    }
                    console.log(errorMessage);
                    return throwError(errorMessage);
                })
            )
    }

}