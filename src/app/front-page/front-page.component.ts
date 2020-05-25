import { Component, OnInit } from '@angular/core';
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
  tasksForTodayCompleted = true;
  today: Date;

  year: Number;
  month: Number;
  day: Number;

  timeToday: String;

  login: boolean;
  
  checkingInProcess: Boolean = false;

  constructor(private taskService: TaskService) {
    
    //Otetaan sessionStoragesta käyttäjänimi haltuun
    const atoken = sessionStorage.getItem('accesstoken');
    if (atoken) {
        this.userName = JSON.parse(atoken).username;
    } 
  }

  ngOnInit(): void {
    this.today = new Date(); //Tallenntetaan tämän hetkinen aika
    
    this.getTasks(); //Haetaan tehtävät tietokannasta
  }

  //Työtehtävän kuittaus tehdyksi
  check(task): void {

    //Huolehditaan siitä että käyttäjä ei ehdi sekaannuttaa asyncronisesti toimivia tietokanta toimintoja nopeilla klikkailuilla..
    //Kun check() funktiota suoritetaan, piilotetaan 'kuittaa'-painikkeet käyttäjältä
    this.checkingInProcess = true;
    setTimeout(() => {
      this.checkingInProcess = false;
    }, 1000);
    
    //Tutkitaan onko tehtävä asetettu toistuvaksi
    if (task.repeat !== 'none') {
      console.log('Task is repetitive. Trying to postpone..');
      this.changeTime(task);
    } else {
      //Jos tehtävä oli kertaluonteinen, niin lisätään se historiaan ja poistetaan aktiivisita tehtävistä

       task.alarmDateTime = new Date(); //Kuvaa nyt aikaa jolloin työ kuitattiin
       this.taskService.addTaskToHistory(task, this.userName).subscribe();

       this.taskService.deleteActiveTask(this.userName, task).subscribe(
         data => {
           this.getTasks();
         }
       );
    }
  }

  /**
   * Metodi muuttaa annetun task-olion muistutuspäivää, lisää kuitatun
   * tehtävän historiaan, poistaa vanhan tehtävän ja lisään uudella päivämäärällä olevan tehtävän aktiivisten tehtävien listaan
   * @param task Task-Olio
   */
  changeTime(task) {

    const newTask = new Task(task.title, task.description, task.alarmDateTime, task.repeat, task.repeatInterval);
    newTask.alarmDateTime = new Date(newTask.alarmDateTime);

    //Selvitetään toistuuko tehtävä viikottain, kuukausittain vai vuosittain
    if( newTask.repeat === 'weekly') {
      console.log('Changing time for weekly repetitive task');
      const daysForward = newTask.repeatInterval *7;
      newTask.alarmDateTime.setDate(newTask.alarmDateTime.getDate()+daysForward);
      console.log(newTask.alarmDateTime);

    } else if ( newTask.repeat === 'monthly') {
      
      const monthsForward = newTask.repeatInterval; 
      newTask.alarmDateTime.setMonth(newTask.alarmDateTime.getMonth()+monthsForward);

    } else if ( newTask.repeat === 'yearly') {
      const yearsForward = newTask.repeatInterval;
      newTask.alarmDateTime.setFullYear(newTask.alarmDateTime.getFullYear()+yearsForward);
    }
    
    this.taskService.deleteActiveTask(this.userName, task).toPromise().then( data => {
      task.alarmDateTime = new Date(); //Kuvaa nyt aikaa jolloin työ kuitattiin
      this.taskService.addTaskToHistory(task, this.userName).subscribe();
    
      console.log(data);
      this.taskService.addTask(newTask, this.userName).subscribe( data => {
        console.log(data);  
        this.getTasks();
        });
    }
    );
    
    
    
  }

  /**
   * Metodi hakee aktiiviset tehtävät tasksToday ja tasksAfterToday listoihin
   */
  getTasks() {
    console.log('Requesting tasks for user: ' +this.userName);
   
    this.taskService.getActiveTasks(this.userName).subscribe(data => {
      if(data.length===0) {
        console.log('No tasks in activeTasks');
        this.tasksToday = []; //Then no tasks today
        this.tasksAfterToday = []; //Neither tasks later
        this.tasksForTodayCompleted = true;
        this.tasksCompleted = true;
        return;
      } else {
        this.tasksCompleted = false;
        console.log(data);
        console.log(data[0].title);
        this.initTasks = data;
        // this.myTasks = data;

        console.log(this.initTasks);
        this.setTasksInOrder();
        console.log(this.myTasks);

        this.timeToday = this.getTime(); //Getting time in String format
        
        this.filterTasksForToday(); //Filter tasks for array tasksToday and tasksAfterToday

        if (this.tasksToday.length === 0) {
          this.tasksForTodayCompleted = true;
        } else {
          this.tasksForTodayCompleted = false;
        }
        console.log(this.tasksToday);
    }
  });
  }

  /**
   * Metodi järjestää muistutusajan mukaan vanhempi päivämäärä listassa kauemmaksi
   */
  setTasksInOrder() {
    if(this.initTasks.length > 1) {
      this.myTasks = this.initTasks.sort((a, b) => {
          a.alarmDateTime = new Date(a.alarmDateTime);
          b.alarmDateTime = new Date(b.alarmDateTime);
          
          return a.alarmDateTime - b.alarmDateTime;
      } );
   } else {
     this.myTasks = this.initTasks;
   }
  }

  /**
   * Metodi suodattaa tämän kuluvan päivän tehtävät muista
   * Ja sijoittaa kunkin tehtävän sille sopivaan listaan
   * joko tasksToday tai tasksAfterToday
   */
  filterTasksForToday() {

    this.tasksAfterToday = [];
    this.tasksToday = this.myTasks.filter((a) => {
      a.alarmDateTime = new Date(a.alarmDateTime);
      if ((a.alarmDateTime.getMonth() <= this.today.getMonth()) && (a.alarmDateTime.getDate() <= this.today.getDate() && (a.alarmDateTime.getFullYear() <= this.today.getFullYear()))){
        return true;
      } else {
        this.tasksAfterToday.push(a);
        return false;
      }
    });
  }

  /**
   * Metodi muuttaa aloitushetken-ajan string-tyyppiseksi
   */
  getTime() {
    this.year = this.today.getFullYear();
    this.month = this.today.getMonth()+1;
    this.day = this.today.getDate()
    return `${this.day}.${this.month}.${this.year}`;
  }

  /**
   * Metodi muuttaa task.alarmDateTime-merkkijonon Date tyyppiseksi
   * Ja palauttaa ajan muokattuna merkkijonona
   * @param task Task-Olio
   */
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

/**
 * Metodi muuttaa englanninkielisen sanan suomenkieliseksi
 * @param repeat weekly | monthly | yearly
 */
getRepeatString(repeat: String) {
  if(repeat === 'weekly') return 'viikko';
  else if(repeat === 'monthly') return 'kuukausi';
  else if(repeat === 'yearly') return 'vuosi';
}

/**
 * Metodi poistaa tehtävän aktiiviset tehtävät taulukosta tietokannassa
 * @param task Poistettava tehtävä
 */
delRepeatingTask(task) {
  let decidedToRemove = confirm('Haluatko varmasti poistaa tehtävän? Valintaa ei voi peruuttaa.');

  if (decidedToRemove) {
    this.taskService.deleteActiveTask(this.userName, task).subscribe( data => this.getTasks());
  } else return;
}
}
