import { Component, OnInit } from '@angular/core';
import { TaskService } from '../task.service';
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  userName: String;

  taskHistory;
  taskHistoryEmpty = true;

  constructor(private taskService: TaskService) {
   
    const atoken = sessionStorage.getItem('accesstoken');
    if (atoken) {
      this.userName = JSON.parse(atoken).username;
    }
   }

  ngOnInit(): void {
    this.getTaskHistory();
  }

  getTaskHistory() {
    
    this.taskService.getTaskHistory(this.userName).subscribe(data => {
      if(data.length === 0) {
        this.taskHistoryEmpty = true;
        return ;
      }
      else {
        this.taskHistoryEmpty = false;
        this.taskHistory = data;
      }
    });
  }

  getTime(task) {
      let time = new Date(task.alarmDateTime);
    
      let hours;
      if(time.getHours() < 10) hours = '0' + time.getHours().toString();
      else hours =  time.getHours().toString();
      let minutes;
      if(time.getMinutes() < 10) minutes = '0' + time.getMinutes().toString();
      else minutes = time.getMinutes().toString();

      return `${time.getDate()}.${time.getMonth()+1}.${time.getFullYear()} ${hours}:${minutes}`;
  }

  del(task) {
    console.log('Yritetty poistaa..');
    this.taskService.deleteTaskFromHistory(this.userName, task._id).subscribe((data) => {
      if (data) {
      this.getTaskHistory();
      }
    });

    
  }
}
