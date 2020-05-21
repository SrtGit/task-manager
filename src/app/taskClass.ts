export class Task {
    title: String;
    description: String;
    alarmDateTime: Date;
    repeat: String; // weekly | monthly | yearly
    repeatInterval: Number;

    constructor(title:String, description:String, date:Date, repetition: String, interval: Number ) {
        this.title = title;
        this.description= description;
        this.alarmDateTime = date; //Pvm ja kellonaika hälytykselle
        this.repeat = repetition; //Aikaväli
        this.repeatInterval = interval; //Kuinka monta aikaväliä hälytysten välillä
    }
    
}
