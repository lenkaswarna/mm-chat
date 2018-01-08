import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';

import { Group } from './interfaces/group';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class GroupService {

  private groupUrl = 'http://localhost:3000/group/controllers/';  // URL to server

  constructor(
    private http: HttpClient) { }

  /** GET groups from the server */
  getGroups (): Observable<Group[]> {
    const userId = 1;
    return this.http.get<Group[]>(`${this.groupUrl}getGroups/user/${userId}/groups`)
      .pipe(
          map(groups => groups),
          tap(groups => console.log(groups)),
        catchError(this.handleError('getGroups', []))
      );
  }

  //////// Save methods //////////

  /** POST: add a new group to the server */
  createGroup (group: Group): Observable<Group> {
    return this.http.post<Group>(`${this.groupUrl}createGroup`, group, httpOptions).pipe(
      map(grp => grp),
      catchError(this.handleError<Group>('createGroup'))
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
