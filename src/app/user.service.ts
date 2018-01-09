import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { User } from './interfaces/user';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class UserService {

  private userUrl = 'http://localhost:3000/user/controllers/';  // URL to server

  constructor(
    private http: HttpClient) { }

  /** GET users from the server */
  getUsers (): Observable<User[]> {
    const userId = 1;
    return this.http.get<User[]>(`${this.userUrl}getUsers`)
      .pipe(
          map(users => users),
          tap(users => console.log(users)),
        catchError(this.handleError('getUsers', []))
      );
  }

  //////// Save methods //////////

  /** POST: add a new user to the server */
  createUser (user: User): Observable<User> {
    return this.http.post<User>(`${this.userUrl}createdUser`, user, httpOptions).pipe(
      map(usr => usr),
      catchError(this.handleError<User>('createUser'))
    );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
