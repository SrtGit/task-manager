import { Component, OnInit } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { TaskService } from '../task.service';
import { Task } from '../taskClass';


@Component({
  selector: 'app-front-page',
  templateUrl: './front-page.component.html',
  styleUrls: ['./front-page.component.css']
})
export class FrontPageComponent implements OnInit {

  userName: String;

  myTasks;
  initTasks;

  tasksToday;
  tasksAfterToday = [];

  tasksCompleted: Boolean = false;
  today: Date;

  year: Number;
  month: Number;
  day: Number;

  timeToday: String;

  login: boolean;
  subscription: Subscription; // Subscription -tyyppiseen olioon voidaan tallentaa observablen tilaus.

  constructor(private authService: AuthService, private taskService: TaskService) {
    // Tilataan viesti ja tallennetaan tulos this.login -muuttujaan
    this.subscription = this.authService.loginTrue().subscribe(message => { this.login = message; });
    /* varmistetaan että login -tila säilyy myös kun sivu reffataan
       varmistus tehdään katsomalla onko token sessionstoragessa.
       Yllä oleva observablen tilaus silti tarvitaan, sillä sessionstoragen
       tarkistus vaatii aina reffauksen koska sitä ei voi kutsua asynkronisesti. */
    const atoken = sessionStorage.getItem('accesstoken');
    if (atoken) {
      this.login = true;
      this.userName = JSON.parse(atoken).username;
    } else {
      this.login = false;
    }
  }

  ngOnInit(): void {
    this.today = new Date();
    
    this.getTasks();

    

  }

  //Työtehtävän kuittaus tehdyksi
  check(task): void {
    
    if (task.repeat !== 'none') {
      console.log('Task is repetitive. Trying to postpone..');
      this.changeTime(this.userName, task);
    }

    task.alarmDateTime = new Date(); //Kuvaa nyt aikaa jolloin työ kuitattiin
    this.taskService.addTaskToHistory(task, this.userName).subscribe();

    this.taskService.deleteActiveTask(this.userName, task).subscribe(
      data => {
        this.getTasks();
      }
    );
    
    
  }

  //Virhe on siinä että pvm ei ole oikeasti tietokannassa DATE-olio!!!
  changeTime(userName, task) {

    const newTask = new Task(task.title, task.descripiton, task.alarmDateTime, task.repeat, task.repeatInterval);

    if( newTask.repeat === 'weekly') {

      console.log('Changing time for weekly repetitive task');
      newTask.alarmDateTime = new Date(newTask.alarmDateTime);
      newTask.alarmDateTime.setDate(newTask.alarmDateTime.getDate()+7);
      console.log(newTask.alarmDateTime);

    } else if ( newTask.repeat === 'monthly') {

    } else if ( newTask.repeat === 'yearly') {

    }
    
    this.taskService.addTask(newTask, userName).subscribe( data => {
      console.log(data);
    });
  }

  getTasks() {
    console.log('Requesting tasks for user: ' +this.userName);
   
    this.taskService.getActiveTasks(this.userName).subscribe(data => {
      if(data.length===0) {
        console.log('No tasks in activeTasks');
        this.tasksToday = [];
        this.tasksCompleted = true;
        return;
      } else {
        this.tasksCompleted = false;
        console.log(data);
        console.log(data[0].title);
        this.initTasks = data;
        this.myTasks = data;

        console.log(this.initTasks);
        this.setTasksInOrder();
        console.log(this.myTasks);

        this.timeToday = this.getTime();
        this.filterTasksForToday();
        console.log(this.tasksToday);
    }
  });
  }
  //Järjestetään tehtävät suoritusjärjestykseen
  setTasksInOrder() {
  //   if(this.initTasks.length > 1) {
  //     this.myTasks = this.initTasks.sort((a, b) => a.alarmDateTime - b.alarmDateTime );
  //  } else {
  //    this.myTasks = this.initTasks;
  //  }
  }

  

  filterTasksForToday() {
    this.tasksToday = this.myTasks.filter((a) => {
      if (true){ //(a.alarmDateTime.getMonth() <= this.today.getMonth()) && (a.alarmDateTime.getDate() <= this.today.getDate()) 
        return true;
      } else {
        this.tasksAfterToday.push(a);
        return false;
      }
    });
  }

  getTime() {
    this.year = this.today.getFullYear();
    this.month = this.today.getMonth()+1;
    this.day = this.today.getDate()
    return `${this.day}.${this.month}.${this.year}`;
  }

  getTaskTime(task) {
    let time = new Date(task.alarmDateTime);
  
    let hours;
    if(time.getHours() < 10) hours = '0' + time.getHours().toString();
    else hours =  time.getHours().toString();
    let minutes;
    if(time.getMinutes() < 10) minutes = '0' + time.getMinutes().toString();
    else minutes = time.getMinutes().toString();

    return `${time.getDate()}.${time.getMonth()+1}.${time.getFullYear()} ${hours}:${minutes}`;
}

}
