import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { UtilsComponent } from '../components/shared/utils/utils.component';


@Injectable({
  providedIn: 'root'
})


export class HttpService {
  public API_URL = 'https://api.github.com/';
  public Local_API_URL = 'http://localhost:8877/';
  constructor(private router: Router, private utils: UtilsComponent, public http: HttpClient, private snackBar: MatSnackBar) { }
  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  //Fetch User Detail from System
  fetchUserInfo(userName: any): Observable<any> {
    return this.http.get<any>(
      this.API_URL + 'users/' + userName, { observe: 'response' }).pipe(
        retry(1), catchError(this.handleError.bind(this))
      )
  }

  //Fetch User repositories Detail from System
  fetchUserRepos(user: any, itemsPerPage: any, page: any): Observable<any> {
    var userName = { userName: user };
    return this.http.get(
      this.API_URL + 'users/' + user + '/repos?per_page=' + itemsPerPage + '&page=' + page, { observe: 'response' }).pipe(
        retry(1), catchError(this.handleError.bind(this))
      )
  }


  // Error handling 
  handleError(error: any) {
    // let crREf = this;
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    this.utils.stopLoader();
    // snack bar to show error
    this.snackBar.open('Invalid User! Please try valid user name', 'X');
    // window.alert(errorMessage);
    return throwError(errorMessage);
  }

}
