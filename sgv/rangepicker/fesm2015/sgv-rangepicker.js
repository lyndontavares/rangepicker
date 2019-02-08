import * as moment_ from 'moment';
import { CommonModule } from '@angular/common';
import { InjectionToken, Component, HostListener, Output, Inject, EventEmitter, Directive, Input, ElementRef, LOCALE_ID, Pipe, NgModule } from '@angular/core';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const moment = moment_;
/** @type {?} */
const presets = [{
        start: moment().startOf('day'),
        end: moment().endOf('day'),
        code: 'TODAY'
    },
    {
        start: moment().subtract(1, 'day').startOf('day'),
        end: moment().subtract(1, 'day').endOf('day'),
        code: 'YESTERDAY'
    },
    {
        start: moment().subtract(2, 'day').startOf('day'),
        end: moment().subtract(2, 'day').endOf('day'),
        code: 'DAY_BEFORE_YESTERDAY'
    },
    {
        start: moment().startOf('isoWeek').startOf('day'),
        end: moment().endOf('day'),
        code: 'CURRENT_WEEK'
    },
    {
        start: moment().startOf('month'),
        end: moment().endOf('day'),
        code: 'CURRENT_MONTH'
    },
    {
        start: moment().startOf('quarter'),
        end: moment().endOf('day'),
        code: 'CURRENT_QUARTER'
    },
    {
        start: moment().startOf('year'),
        end: moment().endOf('day'),
        code: 'CURRENT_YEAR'
    },
    {
        start: moment().subtract(1, 'w').startOf('isoWeek'),
        end: moment().subtract(1, 'w').endOf('isoWeek'),
        code: 'PAST_WEEK'
    },
    {
        start: moment().subtract(1, 'M').startOf('month'),
        end: moment().subtract(1, 'M').endOf('month'),
        code: 'PAST_MONTH'
    },
    {
        start: moment().subtract(1, 'y').startOf('year'),
        end: moment().subtract(1, 'y').endOf('year'),
        code: 'PAST_YEAR'
    },
    {
        start: moment().subtract(15, 'm'),
        end: moment(),
        code: 'LAST_15_MIN'
    },
    {
        start: moment().subtract(30, 'm'),
        end: moment(),
        code: 'LAST_30_MIN'
    },
    {
        start: moment().subtract(1, 'h'),
        end: moment(),
        code: 'LAST_HOUR'
    },
    {
        start: moment().subtract(4, 'h'),
        end: moment(),
        code: 'LAST_4_HOURS'
    },
    {
        start: moment().subtract(12, 'h'),
        end: moment(),
        code: 'LAST_12_HOURS'
    },
    {
        start: moment().subtract(1, 'd'),
        end: moment(),
        code: 'LAST_24_HOURS'
    },
    {
        start: moment().subtract(7, 'd').startOf('day'),
        end: moment().endOf('day'),
        code: 'LAST_7_DAYS'
    },
    {
        start: moment().subtract(30, 'd').startOf('day'),
        end: moment().endOf('day'),
        code: 'LAST_30_DAYS'
    },
    {
        start: moment().subtract(60, 'd').startOf('day'),
        end: moment().endOf('day'),
        code: 'LAST_60_DAYS'
    },
    {
        start: moment().subtract(3, 'M').startOf('day'),
        end: moment().endOf('day'),
        code: 'LAST_QUARTER'
    },
    {
        start: moment().subtract(6, 'M').startOf('day'),
        end: moment().endOf('day'),
        code: 'LAST_6_MONTHS'
    },
    {
        start: moment().subtract(1, 'y').startOf('day'),
        end: moment().endOf('day'),
        code: 'LAST_YEAR'
    },
    {
        start: moment().subtract(2, 'y').startOf('day'),
        end: moment().endOf('day'),
        code: 'LAST_2_YEARS'
    }];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const SgvRangepickerDefaultsService = new InjectionToken('SgvRangepickerDefaults');

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const moment$1 = moment_;
class SgvRangepickerComponent {
    /**
     * @param {?} defaults
     */
    constructor(defaults) {
        this.defaults = defaults;
        this.presets = presets;
        this.tab = 1;
        this.chunkSize = Math.ceil(this.presets.length / 2);
        this.datesChanged = new EventEmitter();
        /**
         * Event bus
         * TODO - ref to observables
         */
        this.events = {
            topics: {},
            /**
             * @param {?} topic
             * @param {?} listener
             * @return {?}
             */
            on(topic, listener) {
                if (!this.topics[topic]) {
                    this.topics[topic] = [];
                }
                this.topics[topic].push(listener);
            },
            /**
             * @param {?} topic
             * @param {?} info
             * @return {?}
             */
            send(topic, info) {
                if (!this.topics[topic]) {
                    return;
                }
                this.topics[topic].forEach((/**
                 * @param {?} listener
                 * @return {?}
                 */
                function (listener) {
                    listener(info);
                }));
            }
        };
        this.visible = false;
    }
    /**
     * @return {?}
     */
    show() {
        this.visible = true;
    }
    /**
     * @return {?}
     */
    hide() {
        this.visible = false;
        this.presets.forEach((/**
         * @param {?} p
         * @return {?}
         */
        (p) => p.hovered = false));
    }
    /**
     * Initialize rangepicker
     * @return {?}
     */
    init() {
        /** @type {?} */
        let counter = 0;
        this.events.on('updateModel', (/**
         * @param {?} date
         * @return {?}
         */
        (date) => {
            if (counter === 0) {
                // pick first time
                this.period.start = date.valueOf();
                this.period.end = null;
            }
            if (counter === 1) {
                // pick second time
                if (date.valueOf() < this.period.start.valueOf()) {
                    this.period.end = moment$1(this.period.start).endOf('day').valueOf();
                    this.period.start = date.valueOf();
                }
                else {
                    this.period.end = date.endOf('day').valueOf();
                }
            }
            if (this.period.start && this.period.end) {
                this.hide();
                this.datesChanged.emit(this.period);
            }
            counter++;
            if (counter === 2) {
                counter = 0;
            }
        }));
        this.events.on('hovered', (/**
         * @param {?} date
         * @return {?}
         */
        (date) => {
            this.hoveredDate = date;
        }));
    }
    /**
     * Prevent bubbling to input
     * @param {?} e
     * @return {?}
     */
    onClick(e) {
        e.stopPropagation();
    }
    /**
     * Set period from presets
     * @param {?} code
     * @return {?}
     */
    setPeriod(code) {
        this.period.start = this.getPresetValueByCode(code, 'start');
        this.period.end = this.getPresetValueByCode(code, 'end');
        this.hide();
        this.datesChanged.emit(this.period);
    }
    /**
     * Get date in ms from preset
     * @private
     * @param {?} code - preset code
     * @param {?} key - end or start
     * @return {?}
     */
    getPresetValueByCode(code, key) {
        return this.presets.find((/**
         * @param {?} p
         * @return {?}
         */
        p => p.code === code))[key].valueOf();
    }
}
SgvRangepickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'sgv-rangepicker',
                template: "<div class=\"m-calendar-wrapper\" *ngIf=\"visible\">\r\n    <header class=\"m-calendar-wrapper__header\" [ngStyle]=\"{'background-color': defaults.color}\">\r\n        <ul>\r\n            <li [ngClass]=\"{'is-active': tab === 1}\" (click)=\"tab = 1\">\r\n                {{ 'PRESETS' | translate }}\r\n            </li>\r\n            <li [ngClass]=\"{'is-active': tab === 2}\" (click)=\"tab = 2\">\r\n                {{ 'DATE_INTERVAL' | translate}}\r\n            </li>\r\n        </ul>\r\n    </header>\r\n    <div class=\"m-calendar-wrapper__inner\">\r\n        <div *ngIf=\"tab === 1\" class=\"m-calendar-wrapper__presets\">\r\n            <div class=\"m-calendar-wrapper__row\">\r\n                <div class=\"m-calendar-wrapper__col\">\r\n                    <ul>\r\n                        <li *ngFor=\"let preset of presets | slice :  0 : chunkSize\"\r\n                            [ngStyle]=\"preset.hovered ? {'color':  defaults.color } : {}\"\r\n                            (click)=\"setPeriod(preset.code);\"\r\n                            (mouseover)=\"preset.hovered=true\"\r\n                            (mouseleave)=\"preset.hovered=false\">\r\n                            {{ preset.code | translate }}\r\n                        </li>\r\n                    </ul>\r\n                </div>\r\n                <div class=\"m-calendar-wrapper__col\">\r\n                    <ul>\r\n                        <li *ngFor=\"let preset of presets | slice : chunkSize: presets.length\"\r\n                            [ngStyle]=\"preset.hovered ? {'color':  defaults.color } : {}\"\r\n                            (click)=\"setPeriod(preset.code);\"\r\n                            (mouseover)=\"preset.hovered=true\"\r\n                            (mouseleave)=\"preset.hovered=false\">\r\n                            {{ preset.code | translate}}\r\n                        </li>\r\n                    </ul>\r\n                </div>\r\n            </div>\r\n\r\n        </div>\r\n        <div class=\"m-calendar-wrapper__row\" *ngIf=\"tab === 2\">\r\n            <div class=\"m-calendar-wrapper__col\">\r\n                <sgv-calendar side=\"left\" [period]=\"period\" [events]=\"events\" [hoveredDate]=\"hoveredDate\"></sgv-calendar>\r\n            </div>\r\n            <div class=\"m-calendar-wrapper__col\">\r\n                <sgv-calendar side=\"right\" [period]=\"period\" [events]=\"events\" [hoveredDate]=\"hoveredDate\"></sgv-calendar>\r\n            </div>\r\n        </div>\r\n    </div>\r\n</div>\r\n",
                styles: [".m-calendar-wrapper{position:absolute;z-index:1000;top:40px;left:0;width:530px;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;border:1px solid #eee;border-radius:2px;background:#fff;box-shadow:0 15px 79.38px 1.62px rgba(0,0,0,.16)}.m-calendar-wrapper--single{width:285px}.m-calendar-wrapper__row{margin:0 -10px}.m-calendar-wrapper__row:after{display:table;clear:both;content:''}.m-calendar-wrapper__col{float:left;box-sizing:border-box;width:50%;padding:0 10px}.m-calendar-wrapper__inner{padding:20px 20px 40px}.m-calendar-wrapper__header{height:70px;line-height:67px;box-shadow:0 2px 2.82px .18px rgba(0,0,0,.24)}.m-calendar-wrapper__header ul{display:table;width:100%;margin:0;padding:0}.m-calendar-wrapper__header li{display:table-cell;width:50%;font-size:14px;cursor:pointer;text-align:center;text-transform:uppercase;color:#fff}.m-calendar-wrapper__header li.is-active{border-bottom:3px solid #fff}.m-calendar-wrapper__presets{padding:20px 0;font-size:14px;font-weight:300;line-height:2}.m-calendar-wrapper__presets ul{margin:0;padding:0}.m-calendar-wrapper__presets li{padding:0 20px;list-style:none;cursor:pointer}"]
            }] }
];
SgvRangepickerComponent.ctorParameters = () => [
    { type: undefined, decorators: [{ type: Inject, args: [SgvRangepickerDefaultsService,] }] }
];
SgvRangepickerComponent.propDecorators = {
    datesChanged: [{ type: Output }],
    onClick: [{ type: HostListener, args: ['click', ['$event'],] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const moment$2 = moment_;
class SgvRangepickerDirective {
    /**
     * @param {?} elemRef
     * @param {?} defaults
     */
    constructor(elemRef, defaults) {
        this.elemRef = elemRef;
        this.defaults = defaults;
        this.windowClick = this.windowClick.bind(this);
    }
    /**
     * @return {?}
     */
    ngAfterViewInit() {
        this.processChange(this.elemRef.nativeElement.value);
        this.sgvRangepicker.init();
        this.sub = this.sgvRangepicker.datesChanged.subscribe((/**
         * @param {?} period
         * @return {?}
         */
        (period) => {
            /** @type {?} */
            const start = Number(period.start);
            /** @type {?} */
            const end = Number(period.end);
            this.elemRef.nativeElement.value = moment$2(start).format(this.defaults.format) + ' - ' + moment$2(end).format(this.defaults.format);
        }));
        window.addEventListener('click', this.windowClick);
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.sub.unsubscribe();
        window.removeEventListener('click', this.windowClick);
    }
    /**
     * Show picker
     * @param {?} e
     * @return {?}
     */
    onclick(e) {
        e.stopPropagation();
        this.sgvRangepicker.show();
    }
    /**
     * Pick dates on input changes
     * @param {?} event - input event
     * @return {?}
     */
    onInput(event) {
        /** @type {?} */
        const value = event.target.value;
        this.processChange(value);
    }
    /**
     * Process changes of input element, set rangepicker model
     * @private
     * @param {?} value - input string
     * @return {?}
     */
    processChange(value) {
        /** @type {?} */
        let valid;
        if (!value) {
            valid = true;
        }
        else {
            /** @type {?} */
            const dates = value.split(' - ');
            /** @type {?} */
            const start = moment$2(dates[0], this.defaults.format);
            /** @type {?} */
            const end = moment$2(dates[1], this.defaults.format);
            valid = start.isValid() && end.isValid() && start.valueOf() <= end.valueOf();
            if (valid) {
                this.sgvRangepicker.period = {
                    start: start.valueOf(),
                    end: end.valueOf()
                };
            }
            else {
                this.sgvRangepicker.period = {};
                this.sgvRangepicker.hide();
            }
        }
    }
    /**
     * @private
     * @return {?}
     */
    windowClick() {
        this.sgvRangepicker.hide();
    }
}
SgvRangepickerDirective.decorators = [
    { type: Directive, args: [{
                selector: '[sgvRangepicker]'
            },] }
];
SgvRangepickerDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: undefined, decorators: [{ type: Inject, args: [SgvRangepickerDefaultsService,] }] }
];
SgvRangepickerDirective.propDecorators = {
    sgvRangepicker: [{ type: Input }],
    onclick: [{ type: HostListener, args: ['click', ['$event'],] }],
    onInput: [{ type: HostListener, args: ['input', ['$event'],] }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const moment$3 = moment_;
class SgvCalendarComponent {
    /**
     * @param {?} locale
     * @param {?} defaults
     */
    constructor(locale, defaults) {
        this.locale = locale;
        this.defaults = defaults;
        this.headings = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.monthIndex = moment$3().month();
        this.year = moment$3().year();
        if (this.side === 'left') {
            this.decMonth();
        }
        this.init();
        this.events.on('navigate', (/**
         * @param {?} direction
         * @return {?}
         */
        (direction) => {
            if (direction === 'prev') {
                this.decMonth();
            }
            else if (direction === 'next') {
                this.incMonth();
            }
            this.init();
        }));
    }
    /**
     * @return {?}
     */
    getMonthTitle() {
        /** @type {?} */
        const str = this.month.locale(this.locale).format('MMMM, YYYY');
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
    /**
     * @param {?} direction
     * @return {?}
     */
    navigate(direction) {
        this.events.send('navigate', direction);
    }
    /**
     * @param {?} day
     * @return {?}
     */
    select(day) {
        if (day.isCurrentMonth) {
            this.events.send('updateModel', day.date);
        }
    }
    /**
     * @param {?} day
     * @return {?}
     */
    onHover(day) {
        if (day.isCurrentMonth) {
            this.events.send('hovered', day.date);
        }
    }
    /**
     * @param {?} date
     * @return {?}
     */
    isSelected(date) {
        /** @type {?} */
        const start = Number(this.period.start);
        /** @type {?} */
        const end = Number(this.period.end);
        return (start && date.isSame(start, 'day')) || (end && date.isSame(end, 'day'));
    }
    /**
     * @param {?} date
     * @return {?}
     */
    isBetween(date) {
        /** @type {?} */
        const start = Number(this.period.start);
        /** @type {?} */
        const end = Number(this.period.end);
        /** @type {?} */
        const hovered = Number(this.hoveredDate);
        if (start && end) {
            return date.isBetween(start, end);
        }
        if (start && hovered) {
            return (date.isBetween(start, hovered) ||
                date.isBetween(hovered, start) ||
                date.valueOf() === hovered);
        }
    }
    // TODO rename ?
    /**
     * @private
     * @return {?}
     */
    init() {
        this.month = moment$3([this.year, this.monthIndex]);
        this.firstMonday = moment$3([this.year, this.monthIndex]).startOf('isoWeek');
        this.weeks = this.buildCalendar();
    }
    /**
     * @private
     * @return {?}
     */
    buildCalendar() {
        /** @type {?} */
        const weeks = [];
        /** @type {?} */
        let done = false;
        /** @type {?} */
        const date = this.firstMonday.clone();
        while (!done) {
            weeks.push({
                days: this.buildWeek(date.clone())
            });
            date.add(1, 'w');
            done = this.monthIndex !== date.month();
        }
        return weeks;
    }
    /**
     * @private
     * @param {?} date
     * @return {?}
     */
    buildWeek(date) {
        /** @type {?} */
        const days = [];
        for (let i = 0; i < 7; i++) {
            days.push({
                name: date.format('dd').substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === this.monthIndex,
                isToday: date.isSame(new Date(), 'day'),
                date: date
            });
            date = date.clone();
            date.add(1, 'd');
        }
        return days;
    }
    /**
     * @private
     * @return {?}
     */
    incMonth() {
        this.monthIndex++;
        if (this.monthIndex === 12) {
            this.monthIndex = 0;
            this.year++;
        }
    }
    /**
     * @private
     * @return {?}
     */
    decMonth() {
        this.monthIndex--;
        if (this.monthIndex === -1) {
            this.monthIndex = 11;
            this.year--;
        }
    }
}
SgvCalendarComponent.decorators = [
    { type: Component, args: [{
                selector: 'sgv-calendar',
                template: "<div class=\"m-calendar\">\r\n\t<header class=\"m-calendar__header\">\r\n\t\t<div class=\"m-calendar__nav m-calendar__nav--left\">\r\n\t\t\t<i (click)=\"navigate('prev')\" *ngIf=\"side !== 'right'\"></i>\r\n\t\t</div>\r\n\t\t<div class=\"m-calendar__title\" >\r\n\t\t\t{{ getMonthTitle() }}\r\n\t\t</div>\r\n\t\t<div class=\"m-calendar__nav m-calendar__nav--right\">\r\n\t\t\t<i (click)=\"navigate('next')\" *ngIf=\"side !== 'left'\"></i>\r\n\t\t</div>\r\n\t</header>\r\n\r\n\t<table>\r\n\t\t<thead>\r\n\t\t\t<th *ngFor=\"let th of headings\">{{th}}</th>\r\n\t\t</thead>\r\n\t\t<tbody>\r\n\t\t\t<tr *ngFor=\"let week of weeks\">\r\n\t\t\t\t<td *ngFor=\"let day of week.days\" \r\n\t\t\t\t\t(click)=\"select(day)\"\r\n\t\t\t\t\t(mouseover)=\"onHover(day);\">\r\n\t\t\t\t\t\r\n\t\t\t\t\t<span class=\"m-calendar__day\"\r\n\t\t\t\t\t\t  [ngClass]=\"{\r\n\t\t\t\t\t\t\t\t\t'is-today': day.isToday,\r\n\t\t\t\t\t\t\t\t\t'is-selected': isSelected(day.date)\r\n\t\t\t\t\t\t\t\t\t}\"\r\n\t\t\t\t\t\t  [ngStyle]=\"isBetween(day.date) ? {'color': defaults.color} : {}\"\r\n\t\t\t\t\t\t  *ngIf=\"day.isCurrentMonth\">\r\n\t\t\t\t\t\t{{day.number}}\r\n\t\t\t\t\t\t<span class=\"m-calendar__selected-day\"\r\n\t\t\t\t\t\t\t  [ngStyle]=\"isSelected(day.date) ? {'background-color': defaults.color, 'display': 'block'} : {}\"></span>\r\n\t\t\t\t\t</span>\r\n\t\t\t\t</td>\r\n\t\t\t</tr>\r\n\t\t</tbody>\r\n\t</table>\r\n</div>\r\n",
                styles: [".m-calendar{width:100%}.m-calendar__header{display:table;width:100%;height:60px;table-layout:fixed}.m-calendar__nav{display:table-cell;width:50px;vertical-align:middle}.m-calendar__nav--left{text-align:left}.m-calendar__nav--left i{display:inline-block;width:24px;height:24px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAAN0lEQVR4AWOgEIyCBiAkSfl/ht8MWqQpDyFNeShpysNIUf4HpJw0DeFA1nDRokWaljry0tQoAABoiB3OU+DRDgAAAABJRU5ErkJggg==)}.m-calendar__nav--right{text-align:right}.m-calendar__nav--right i{display:inline-block;width:24px;height:24px;background-image:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAQAAABKfvVzAAAANElEQVR4AWMgE4yCRoYGUpTrMvxh+E+algjStUSSriWKdC3REC2UaBh45TSMuAYgpAiMAgDU3h38ltq8/gAAAABJRU5ErkJggg==)}.m-calendar__nav i{margin:0 8px;cursor:pointer;vertical-align:middle}.m-calendar__title{display:table-cell;font-size:14px;font-weight:500;text-align:center;vertical-align:middle}.m-calendar table{width:100%}.m-calendar table td,.m-calendar table th{height:34px;font-size:12px;font-weight:500;text-align:center}.m-calendar table th{color:#9e9e9e}.m-calendar table td{cursor:pointer}.m-calendar__day{position:relative;display:inline-block;height:34px;line-height:34px}.m-calendar__day.is-today{color:#21a497}.m-calendar__day.is-selected{color:#fff!important}.m-calendar__selected-day{display:none;position:absolute;z-index:-1;top:50%;left:50%;width:34px;height:34px;margin-top:-17px;margin-left:-17px;border-radius:50%}"]
            }] }
];
SgvCalendarComponent.ctorParameters = () => [
    { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] },
    { type: undefined, decorators: [{ type: Inject, args: [SgvRangepickerDefaultsService,] }] }
];
SgvCalendarComponent.propDecorators = {
    side: [{ type: Input }],
    period: [{ type: Input }],
    events: [{ type: Input }],
    hoveredDate: [{ type: Input }]
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const translations = {
    'PRESETS': {
        'en': 'Presets',
        'ru': 'Предустановленные'
    },
    'DATE_INTERVAL': {
        'en': 'Date interval',
        'ru': 'Интервал дат'
    },
    'TODAY': {
        'en': 'Today',
        'ru': 'Сегодня'
    },
    'YESTERDAY': {
        'en': 'Yesterday',
        'ru': 'Вчера'
    },
    'DAY_BEFORE_YESTERDAY': {
        'en': 'Day before yesterday',
        'ru': 'Позавчера'
    },
    'CURRENT_WEEK': {
        'en': 'Current week',
        'ru': 'Текущая неделя'
    },
    'CURRENT_MONTH': {
        'en': 'Current month',
        'ru': 'Текущий месяц'
    },
    'CURRENT_QUARTER': {
        'en': 'Current quarter',
        'ru': 'Текущий квартал'
    },
    'CURRENT_YEAR': {
        'en': 'Current year',
        'ru': 'Текущий год'
    },
    'PAST_WEEK': {
        'en': 'Past week',
        'ru': 'Предыдущая неделя'
    },
    'PAST_MONTH': {
        'en': 'Past month',
        'ru': 'Предыдущий месяц'
    },
    'PAST_YEAR': {
        'en': 'Past year',
        'ru': 'Предыдущий год'
    },
    'LAST_15_MIN': {
        'en': 'Last 15 minutes',
        'ru': 'Последние 15 минут'
    },
    'LAST_30_MIN': {
        'en': 'Last 30 minutes',
        'ru': 'Последние 30 минут'
    },
    'LAST_HOUR': {
        'en': 'Last hour',
        'ru': 'Последний час'
    },
    'LAST_4_HOURS': {
        'en': 'Last 4 hours',
        'ru': 'Последние 4 часа'
    },
    'LAST_12_HOURS': {
        'en': 'Last 12 hours',
        'ru': 'Последние 12 часов'
    },
    'LAST_24_HOURS': {
        'en': 'Last 24 hours',
        'ru': 'Последние 24 часа'
    },
    'LAST_7_DAYS': {
        'en': 'Last 7 days',
        'ru': 'Последние 7 дней'
    },
    'LAST_30_DAYS': {
        'en': 'Last 30 days',
        'ru': 'Последние 30 дней'
    },
    'LAST_60_DAYS': {
        'en': 'Last 60 days',
        'ru': 'Последние 60 дней'
    },
    'LAST_QUARTER': {
        'en': 'Last quarter',
        'ru': 'Последний квартал'
    },
    'LAST_6_MONTHS': {
        'en': 'Last 6 months',
        'ru': 'Последние 6 месяцев'
    },
    'LAST_YEAR': {
        'en': 'Last year',
        'ru': 'Последний 1 год'
    },
    'LAST_2_YEARS': {
        'en': 'Last 2 years',
        'ru': 'Последние 2 года'
    }
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SgvTranslatePipe {
    /**
     * @param {?} locale
     */
    constructor(locale) {
        this.locale = locale;
    }
    /**
     * @param {?} value
     * @return {?}
     */
    transform(value) {
        return translations[value][this.locale] || value;
    }
}
SgvTranslatePipe.decorators = [
    { type: Pipe, args: [{
                name: 'translate'
            },] }
];
SgvTranslatePipe.ctorParameters = () => [
    { type: String, decorators: [{ type: Inject, args: [LOCALE_ID,] }] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class SgvRangepickerModule {
    /**
     * @param {?=} config
     * @return {?}
     */
    static forRoot(config = {}) {
        return {
            ngModule: SgvRangepickerModule,
            providers: [
                { provide: LOCALE_ID, useValue: 'en' },
                {
                    provide: SgvRangepickerDefaultsService,
                    useValue: Object.assign({
                        color: '#3f51b5',
                        format: 'DD.MM.YYYY'
                    }, config)
                }
            ]
        };
    }
}
SgvRangepickerModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [
                    SgvRangepickerDirective,
                    SgvCalendarComponent,
                    SgvRangepickerComponent,
                    SgvTranslatePipe
                ],
                exports: [
                    SgvRangepickerDirective,
                    SgvRangepickerComponent
                ]
            },] }
];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingOverride,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { SgvRangepickerModule, SgvRangepickerDirective, SgvCalendarComponent, SgvRangepickerComponent, SgvTranslatePipe, SgvRangepickerDefaultsService as ɵa };

//# sourceMappingURL=sgv-rangepicker.js.map