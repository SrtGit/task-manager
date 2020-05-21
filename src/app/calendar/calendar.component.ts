import { Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  @Output() calendarEvent: EventEmitter<Date> = new EventEmitter();

  dateViewNow: Date;
  today: Date;

  monthNumber;
  month; //Missä kuukaudessa kalenterin näkymä on
  year; //Missä vuodessa kalenteri näkymä on
  daysInMonth; //Montako päivää kuukaudessa on

  monthStartsOn; //Viikonpäivä jona kuukausi alkaa
  date; //Monesko kuukauden päivä nyt on

  days = []; //Lista, johon tallennetaan kuukauden päivät

  dayBoxStyle;

  selectedDay; //day that is selected from calendar
  selectedMonth;
  selectedYear;

  selectedDate;

  constructor() { }

  ngOnInit(): void {

    this.dayBoxStyle = 'dayNotSelected';

    this.dateViewNow = new Date();
    this.today = this.dateViewNow;

    this.monthNumber = this.dateViewNow.getMonth(); //tammikuussa palautuu 0
    this.year = this.dateViewNow.getFullYear();

    //Valitaan alustavasti kalenterista kuluva päivä
    this.selectedDay = this.dateViewNow.getDate();
    this.selectedMonth = this.monthNumber;
    this.selectedYear = this.year;
    this.calendarEvent.emit(this.dateViewNow);

    this.createMonthView();

    console.log("Initialized!"+ this.monthNumber + " " + this.days.length);
  }
  
  selectDay(day) {
    if(day == '') day = this.daysInMonth;
    if(day == '-') day = 1;
    
    this.selectedDate = new Date(this.year, this.monthNumber, day);

    this.calendarEvent.emit(this.selectedDate);

    //Asetetaan pvm kalenteria varten.
    this.selectedDay = this.selectedDate.getDate();
    this.selectedMonth = this.selectedDate.getMonth();
    this.selectedYear = this.selectedDate.getFullYear();

    console.log(`Selected Date: ${this.selectedDate.getDate()}.${this.selectedDate.getMonth()+1}.${this.selectedDate.getFullYear()}`);
  }

  nextMonth() {
    this.changeMonth(1);
    this.createMonthView();
  }

  prevMonth() {
    this.changeMonth(-1);
    this.createMonthView();
  }

  changeMonth(a:Number) {
    this.monthNumber += a;
    if(this.monthNumber>11) {
      this.monthNumber = 0;
      this.year++;
    } else if(this.monthNumber<0) {
      this.monthNumber = 11;
      this.year--;
    }
  }
  createMonthView():void {

    this.month = this.getMonthInString(this.monthNumber);

    this.monthStartsOn = new Date(this.year, this.monthNumber, 1).getDay();
    if(this.monthStartsOn === 0) this.monthStartsOn = 7; //Korjataan 0:s päivä vastaamaan seitsemättä päivää

    this.daysInMonth = this.getDaysInMonth(this.monthNumber, this.year);

    this.createListOfDays();
  }

  createListOfDays() {
    let day = 1;

    //Määritellään montako laatikkoa tehdään
    let dayBoxes = 35;
    if(this.daysInMonth+(this.monthStartsOn) > 35) {
      dayBoxes = 42;
    }
    console.log(`${this.month} starts on: ${this.monthStartsOn}, days in Month: ${this.daysInMonth}`);

    //Nollataan taulukko
    this.days = [];
    for (let i=1; i<dayBoxes; i++) {
        if ( i>=this.monthStartsOn && day<=this.daysInMonth ) {
          this.days.push(day);
          
          day++;
        }
        else if (i<this.monthStartsOn) this.days.push("-");
        if (day > this.daysInMonth && i!=dayBoxes) {
          this.days.push("");
        }
        
    }
  }
  // Seuraava funktio on kopioitu: 
  // https://medium.com/@nitinpatel_20236/challenge-of-building-a-calendar-with-pure-javascript-a86f1303267d
  getDaysInMonth (iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
  }

  getMonthInString(a: Number) {
    let month = "";  
    
    switch (a) {
        case 0:
          month = "Tammikuu"
          break;
        case 1:
          month = "Helmikuu"
          break;
        case 2:
          month = "Maaliskuu"
          break;
        case 3:
          month = "Huhtikuu"
          break;
        case 4:
          month = "Toukokuu"
          break;
        case 5:
          month = "Kesäkuu"
          break;
        case 6:
          month = "Heinäkuu"
          break;
        case 7:
          month = "Elokuu"
          break;
        case 8:
          month = "Syyskuu"
          break;
        case 9:
          month = "Lokakuu"
          break;
        case 10:
          month = "Marraskuu"
          break;
        case 11:
          month = "Joulukuu"
          break;
          
        default:
          break;
      }
      return month;
  }
}
