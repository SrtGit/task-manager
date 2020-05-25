/*
Kalenteri komponentti, yhtä pientä funktiota lukuunottamatta itse rakennettu ja mietitty.
Kopioitu funktio merkitty koodiin.
*/

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
  month: String; //Missä kuukaudessa kalenterin näkymä on
  year: number; //Missä vuodessa kalenteri näkymä on
  daysInMonth: number; //Montako päivää kuukaudessa on

  monthStartsOn; //Viikonpäivä jona kuukausi alkaa
  date; //Monesko kuukauden päivä nyt on

  days = []; //Lista, johon tallennetaan kuukauden päivät

  dayBoxStyle: String;

  selectedDay: number; //päivä, joka on valittu kalenterista
  selectedMonth: number;
  selectedYear: number;

  selectedDate: Date;

  constructor() { }

  ngOnInit(): void {

    this.dayBoxStyle = 'dayNotSelected';

    //Tallennetaan kuluva päivä
    this.dateViewNow = new Date(); 
    this.today = this.dateViewNow;

    this.monthNumber = this.dateViewNow.getMonth(); //tammikuussa palautuu 0
    this.year = this.dateViewNow.getFullYear();

    //Valitaan alustavasti kalenterista kuluva päivä
    this.selectedDay = this.dateViewNow.getDate();
    this.selectedMonth = this.monthNumber;
    this.selectedYear = this.year;
    this.calendarEvent.emit(this.dateViewNow); //Lähetettää parent-elementille kuluvan päivän

    //Luodaan kalenterinäkymä
    this.createMonthView();

    console.log("Initialized!"+ this.monthNumber + " " + this.days.length);
  }
  
  /**
   * Metodi lähettää käyttäjän valitseman päivämäärän parent-elementille
   * @param day Kalenterissa näkyvä päivä
   */
  selectDay(day): void {
    //Käsitellään tilanteet joissa käyttäjä klikkasi laatikko, jossa ei ole numeroa, vaan '' tai -
    if(day == '') day = this.daysInMonth; //Merkitään kuukauden viimeiseksi päiväksi
    if(day == '-') day = 1; //Merkitään kuun ensimmäiseksi päiväksi
    
    //Päivitetään selectedDate
    this.selectedDate = new Date(this.year, this.monthNumber, day);

    //Lähetetään päivitetty valinta parent-elementille
    this.calendarEvent.emit(this.selectedDate);

    //Asetetaan pvm kalenteria varten.
    this.selectedDay = this.selectedDate.getDate();
    this.selectedMonth = this.selectedDate.getMonth();
    this.selectedYear = this.selectedDate.getFullYear();

  }

  /**
   * Metodi päivittää kalenterinäkymän seuraavaan kuukauteen
   */
  nextMonth(): void {
    this.changeMonth(1);
    this.createMonthView();
  }

  /**
   * Metodi päivittää kalenterinäkymän edelliseen kuukauteen
   */
  prevMonth(): void {
    this.changeMonth(-1);
    this.createMonthView();
  }

  /**
   * Metodi siirtää kalenterin kuukausinäkymää annetun numeron verran
   * @param a Kuvaa sitä halutaanko siirtyä askel eteen vai taakse 1/-1
   */
  changeMonth(a:Number): void {
    //Tutkitaan a:n oikeellisuus
    if(a !== 1 || a!== -1) {
      console.log("Error in function changeMonth! Invalid argument, expected 1 or -1 but got: " + a);
      return;
    }
    this.monthNumber += a;
    if(this.monthNumber>11) { //Jos ylitettiin viimeinen kuukausi..
      this.monthNumber = 0;
      this.year++;
    } else if(this.monthNumber<0) { //Jos mentiin taaksepäin tammikuusta..
      this.monthNumber = 11;
      this.year--;
    }
  }

  /**
   * Metodi muuttaa kalenterin näkymää vastaamaan valittua kuukautta
   */
  createMonthView():void {

    this.month = this.getMonthInString(this.monthNumber);

    this.monthStartsOn = new Date(this.year, this.monthNumber, 1).getDay();
    if(this.monthStartsOn === 0) this.monthStartsOn = 7; //Korjataan 0:s päivä vastaamaan seitsemättä päivää

    //Lasketaan montako päivää kuukaudessa on
    this.daysInMonth = this.getDaysInMonth(this.monthNumber, this.year);

    this.createListOfDays();
  }

  /**
   * Meotdi luo listan kuukauden päivien numeroista. Listaa käytetään kuukausinäkymän piirtämisessä.
   */
  createListOfDays(): void {
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
  /**
   * Tutkitaan montako päivää on kuukaudessa. Yksinkertainen funktio on kopioitu osoitteesta:
   * https://medium.com/@nitinpatel_20236/challenge-of-building-a-calendar-with-pure-javascript-a86f1303267d
   * @param iMonth Kuukausi, jonka päivät halutaan tutkia
   * @param iYear Vuosi, jona kyseinen kuukausi esiintyy
   */
  getDaysInMonth (iMonth, iYear) {
    return 32 - new Date(iYear, iMonth, 32).getDate();
  }

  /**
   * Metodi palauttaa kuukauden numeroarvoa vastaavan merkkijonon
   * @param a Kuukauden numeroarvo 0 = 'Tammikuu' ... 11 = 'Joulukuu'
  */
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
