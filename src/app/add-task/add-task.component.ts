import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl} from '@angular/forms';
import { Router } from '@angular/router';

import { Task } from '../taskClass';
import {TaskService} from '../task.service';
@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {

  addTaskForm = new FormGroup({
      taskTitle: new FormControl(''),
      taskDescription: new FormControl(''),
      taskIsRepeating: new FormControl(''),
      timePeriod: new FormControl(''),
      alarmTime: new FormControl(''),
      repeatEveryXtimePeriod: new FormControl(''),
      weekdayRepeat: new FormControl('')
  });

  selectedDateTime: Date;
  selectedMonth: String;
  selectedDate: String;

  showRepeatTimeDetails: Boolean;

  newTask: Task;
  
  constructor(private taskService : TaskService, private router: Router) { 
    
  }

  ngOnInit(): void {
    this.selectedDateTime = new Date();
    this.addTaskForm.patchValue({alarmTime: '08:00'});
  }

  onSubmit() {
    // TODO: Use EventEmitter with form value
    console.warn(this.addTaskForm.value);

    //Set title and description
    let taskTitle = this.addTaskForm.get('taskTitle').value;
    let taskDescription = this.addTaskForm.get('taskDescription').value;

    //Set task time
    let time = this.addTaskForm.get('alarmTime').value;

    let dateTimeString = `${this.selectedDateTime.getFullYear()}-${this.selectedMonth}-${this.selectedDate}T${time}:00`;
    
    let alarmTime  = new Date(dateTimeString);
    console.log(dateTimeString);
    //Set repeat period
    let repeatPeriod : String = this.addTaskForm.get('timePeriod').value;
    if (this.addTaskForm.get('taskIsRepeating').value == false) repeatPeriod = 'none';

    let interval: Number = this.addTaskForm.get('repeatEveryXtimePeriod').value;


    this.newTask = new Task(taskTitle, taskDescription, alarmTime, repeatPeriod, interval);

    const user= JSON.parse(sessionStorage.getItem('accesstoken'));
    
    console.log(this.newTask, user.username);

    this.taskService.addTask(this.newTask, user.username).subscribe();

    this.router.navigate(['/front-page']);

  }

  onCalendarEvent(newDate ) {
      //console.log('New Date: ' + newDate);
      this.selectedDateTime = newDate;
      
      //Set month as a String
      this.selectedMonth = `${this.selectedDateTime.getMonth()+1}`;
      console.log(this.selectedMonth);
      //Must be: 01, 02, 03, ... 10, 11, 12
      if (this.selectedDateTime.getMonth()+1 < 10) this.selectedMonth = '0' + this.selectedMonth;
      else this.selectedMonth = this.selectedMonth;
      console.log(this.selectedMonth);
      //Set date or 'day'
      this.selectedDate;
      if(this.selectedDateTime.getDate() < 10 ) this.selectedDate = '0' + this.selectedDateTime.getDate();
      else this.selectedDate = this.selectedDateTime.getDate().toString();

  }

}
