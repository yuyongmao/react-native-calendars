import XDate from 'xdate';
export declare function sameMonth(a?: XDate, b?: XDate): boolean;
export declare function sameDate(a?: XDate, b?: XDate): boolean;
export declare function onSameDateRange({ firstDay, secondDay, numberOfDays, firstDateInRange, }: {
    firstDay: string;
    secondDay: string;
    numberOfDays: number;
    firstDateInRange: string;
}): boolean;
export declare function sameWeek(a: string, b: string, firstDayOfWeek: number): boolean;
export declare function isPastDate(date: string): boolean;
export declare function isToday(date?: XDate | string): boolean;
export declare function isGTE(a: XDate, b: XDate): boolean;
export declare function isLTE(a: XDate, b: XDate): boolean;
export declare function formatNumbers(date: number | XDate | string | undefined): string;
export declare function month(date: XDate): XDate[];
export declare function weekDayNames(firstDayOfWeek?: number): string[];
export declare function page(date: XDate, firstDayOfWeek?: number, showSixWeeks?: boolean): XDate[];
export declare function isDateNotInRange(date: XDate, minDate: string, maxDate: string): boolean;
export declare function getWeekDates(date: string, firstDay?: number, format?: string): XDate[] | string[] | undefined;
export declare function getPartialWeekDates(date?: string, numberOfDays?: number): string[];
export declare function generateDay(originDate: string | XDate, daysOffset?: number): string;
/**
 * Copied directly from XDate's locale_detail interface.
 */
interface xdate_locale_detail {
    monthNames?: string[] | undefined;
    monthNamesShort?: string[] | undefined;
    dayNames?: string[] | undefined;
    dayNamesShort?: string[] | undefined;
    amDesignator?: string | undefined;
    pmDesignator?: string | undefined;
}
export interface LocaleDetail extends xdate_locale_detail {
    today?: string;
    numbers?: string[];
    formatAccessibilityLabel?: string;
}
export declare function getLocale(): LocaleDetail;
export {};
