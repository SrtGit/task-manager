import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from './taskClass';
import { catchError } from 'rxjs/operators';

const headers = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class TaskService {

  private apiUrl = 'http://localhost:3000/tasks'; // apin osoite

  constructor(private http: HttpClient) { } // HttpClientin DI

  // Virheenkäsittelymetodi joka palauttaa observablen
  private handleError(error: any): Observable<any> {
    console.error('An error occurred', error);
    return (error.message || error);
  }
  // Kaikkien opiskelijoiden haku. Palauttaa observablena opiskelijataulukon
  getActiveTasks(userName: String): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/activeTasks/${userName}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getTaskHistory(userName: String): Observable<Task[]> {
    return this.http.get<Task[]>(`${this.apiUrl}/taskHistory/${userName}`)
      .pipe(
        catchError(this.handleError)
      );
  }
  // Opiskelijan haku id:n perusteella. Palauttaa observablena opiskelijan.
  /*
  getStudent(id: number): Observable<Student> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<Student>(url)
      .pipe(
        catchError(this.handleError)
      );
  }
  */

  /** POST: lisätään opiskelija palvelimelle.
   * Studentin tyyppi on any, koska _id puuttuu eikä noudateta student.ts:n mallia.
   * _id jätetään pois opiskelijaa lisättaessä, koska Mongo lisää sen automaattisesti
  */
  addTask(task: any, userName:String): Observable<Task> {
    console.log('Adding task to activeTasks..');
    // serveri vaatii tokenin jotta kannan muokkaus olisi mahdollista
    const mytoken = JSON.parse(sessionStorage['accesstoken']);
    task.token = mytoken.token; // pistetään token bodyn mukana
    const url = `${this.apiUrl}/addActiveTask/${userName}`;

    return this.http.post<Task>(url, task, headers)
      .pipe(
        catchError(this.handleError)
      );
  }


  addTaskToHistory(task: any, userName:String): Observable<Task> {
    // serveri vaatii tokenin jotta kannan muokkaus olisi mahdollista
    const mytoken = JSON.parse(sessionStorage['accesstoken']);
    task.token = mytoken.token; // pistetään token bodyn mukana
    const url = `${this.apiUrl}/addToTaskHistory/${userName}`;

    return this.http.post<Task>(url, task, headers)
      .pipe(
        catchError(this.handleError)
      );
  }
  /** PUT: Päivitetään opiskelija id:n perusteella. */
  // updateStudent(student: any): Observable<Student> {
  //   const mytoken = JSON.parse(sessionStorage['accesstoken']);
  //   student.token = mytoken.token; // pistetään token bodyn mukana
  //   const url = `${this.apiUrl}/${student._id}`;
  //   return this.http.put<Student>(url, student, headers).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  /** DELETE: Poistetaan opiskelija id:n perusteella.
   *  Token laitettu menemään headerin mukana
  */
 
  deleteActiveTask(userName:String, task): Observable<Task> {
    const taskId = task._id;

    const mytoken = JSON.parse(sessionStorage['accesstoken']);
    const tokenheaders = { headers: new HttpHeaders({ 'x-access-token': mytoken.token }) };

    const url = `${this.apiUrl}/delActiveTask/${userName}/${taskId}`;
    return this.http.delete<Task>(url, tokenheaders).pipe(
      catchError(this.handleError)
    );
  }

  deleteTaskFromHistory(userName:String, taskId: string): Observable<Task> {
    const mytoken = JSON.parse(sessionStorage['accesstoken']);
    const tokenheaders = { headers: new HttpHeaders({ 'x-access-token': mytoken.token }) };

    const url = `${this.apiUrl}/delTaskFromHistory/${userName}/${taskId}`;
    return this.http.delete<Task>(url, tokenheaders).pipe(
      catchError(this.handleError)
    );
  }

  //Clear taskHistory
  /*
  db.tasks.update({}, { $set : {'activeTasks':[]}},{multi:true})
  */

}
