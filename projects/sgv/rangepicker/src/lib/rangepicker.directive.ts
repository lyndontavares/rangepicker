/**
 * Rangepicker directive for input elements
 */

import { Directive, Input, ElementRef, OnInit, HostListener, AfterViewInit, OnDestroy } from '@angular/core';
import { SgvRangepickerComponent } from './rangepicker/rangepicker.component';
import * as moment_ from 'moment';
import { CalendarPeriod } from './types';
import { Subscription } from 'rxjs';
const moment = moment_;

@Directive({
	selector: '[sgvRangepicker]'
})
export class SgvRangepickerDirective implements AfterViewInit, OnDestroy {

	private sub: Subscription;

	@Input()
	private sgvRangepicker: SgvRangepickerComponent;

	constructor(
		private elemRef: ElementRef
	) {
		this.windowClick = this.windowClick.bind(this);
	}

	ngAfterViewInit() {
		this.processChange(this.elemRef.nativeElement.value);
		this.sgvRangepicker.init();

		this.sub = this.sgvRangepicker.datesChanged.subscribe((period: CalendarPeriod) => {
			const start = Number(period.start);
			const end = Number(period.end);
			this.elemRef.nativeElement.value = moment(start).format('DD.MM.YYYY') + ' - ' + moment(end).format('DD.MM.YYYY');
		});

		window.addEventListener('click', this.windowClick);
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
		window.removeEventListener('click', this.windowClick);
	}

	/**
	 * Show picker
	 */
	@HostListener('click', ['$event'])
	public onclick(e): void {
		e.stopPropagation();
		this.sgvRangepicker.show();
	}

	/**
	 * Pick dates on input changes
	 * @param event - input event
	 */
	@HostListener('input', ['$event'])
	public onInput(event): void {
		const value = event.target.value;
		this.processChange(value);
	}

	/**
	 * Process changes of input element, set rangepicker model
	 * @param value - input string
	 */
	private processChange(value: string): void {
		let valid: boolean;

		if (!value) {
			valid = true;
		} else {
			const dates = value.split(' - ');

			const start = moment(dates[0], 'DD.MM.YYYY');
			const end =  moment(dates[1], 'DD.MM.YYYY');

			valid = start.isValid() && end.isValid() && start.valueOf() <= end.valueOf();

			if (valid) {
				this.sgvRangepicker.period = {
					start: start.valueOf(),
					end: end.valueOf()
				};
			} else {
				this.sgvRangepicker.period = {};
				this.sgvRangepicker.hide();
			}
		}
	}

	private windowClick() {
		this.sgvRangepicker.hide();
	}

}