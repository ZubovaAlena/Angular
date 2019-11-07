import { Component, OnInit, Input, Output, EventEmitter, HostBinding } from '@angular/core';
import * as cloneDeep from 'lodash/cloneDeep';
import { DomSanitizer } from '@angular/platform-browser';

const clone: cloneDeep = ( cloneDeep as any).default || cloneDeep;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  myDate = new Date();
  @HostBinding('style')
  get style() {
    return this.sanitizer.bypassSecurityTrustStyle(
      `--themecolor: ${this.themecolor};`
    );
  }
  @Input()
  themecolor: any = '#ff0000';
  @Input()
  events = [];

  @Input()
  viewDate: Date = new Date();

  @Output()
  eventClicked = new EventEmitter<any>();

  @Output()
  actionClicked = new EventEmitter<any>();

  loader: any = false;
  days: any = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
  dayindex: any;
  daydetails: any = {};
  year: any = new Date().getFullYear();
  calendar: any = [];
  spinner: any = true;

constructor(public sanitizer: DomSanitizer) { }
ngOnInit() {
    this.initCalendar(this.viewDate);
  }
initCalendar(date) {
    this.year = date.getFullYear();
    this.calendar = [];
    this.spinner = true;
    for (let index = 0; index < 12; index++) {
      this.calendar.push({
        date: new Date(this.year, index + 1, 0),
        days: this.generateCalendar(index + 1, this.year)
      });
    }
    const self = this;
    setTimeout(() => {
      self.spinner = false;
    }, 2000);
  }
generateCalendar(month, year) {
    const monthList = [];
    const nbweeks = CalendarComponent.getNbWeeks(month, year);
    let dayone = new Date(year, month - 1, 1).getDay();
    const nbdaysMonth = new Date(year, month, 0).getDate();
    const lastdayindex = new Date(year, month - 1, nbdaysMonth).getDay();
    let lastday = 7;
    let day = 1;
    const today = new Date().toDateString();

    for (let indexweek = 0; indexweek < nbweeks; indexweek++) {
      monthList[indexweek] = [];
      if (nbweeks === indexweek + 1) {
        lastday = lastdayindex + 1;
      }
      if (indexweek > 0) {
        dayone = 0;
      }
      for (let indexday = dayone; indexday < lastday; indexday++) {
        const d1 = new Date(year, month - 1, day).toDateString();
        const istoday = d1 === today;
        const colorsEvents = this.getnbevents(day, month - 1);
        monthList[indexweek][indexday] = {
          day,
          istoday,
          colors: colorsEvents.color,
          events: [],
          nb: colorsEvents.nb
        };
        day++;
      }
    }
    return monthList;
  }
  static getNbWeeks(month, year) {
    const dayone = new Date(year, month - 1, 1).getDay();
    const nbdaysMonth = new Date(year, month, 0).getDate();
    const lastday = new Date(year, month - 1, nbdaysMonth).getDay();
    return (nbdaysMonth + dayone + (6 - lastday)) / 7;
  }
getTodayEvents(day, month) {
    this.daydetails = {};

    if (this.events.length > 0) {
      this.loader = true;
      this.daydetails = clone(day);
      const d1 = new Date(this.year, month, day.day).toDateString();

      for (let index = 0; index < this.events.length; index++) {
        const element = this.events[index];
        const d2 = element.start.toDateString();
        if (d2 === d1) {
          this.daydetails.events.push(element);
        }
        if (index === this.events.length - 1) {
          const self = this;
          setTimeout(() => {
            self.loader = false;
          }, 1000);
        }
      }
    }
  }
getnbevents(day, month) {
    let nb = 0;
    const colors = [];
    if (this.events.length > 0) {
      const d1 = new Date(this.year, month, day).toDateString();
      for (let index = 0; index < this.events.length; index++) {
        const element = this.events[index];
        const d2 = element.start.toDateString();
        if (d2 === d1) {
          nb++;
          colors.push(element.color.secondary);
        }
      }
      return ({ nb, color: colors.toString() });
    } else {
      return { color: '', nb: 0 };
    }
  }
eventClickedFn(event) {
    this.eventClicked.emit(event);
  }
refresh(date) {
    this.initCalendar(date);
  }
actionClickedFn(action, event?) {
    this.actionClicked.emit({action, event});
  }
}
