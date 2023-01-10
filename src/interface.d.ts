/// <reference types="xdate" />
import { DateData } from "./types";
export declare function padNumber(n: number): string;
export declare function xdateToData(date: XDate | string): DateData;
export declare function parseDate(d?: any): XDate | undefined;
export declare function toMarkingFormat(d: XDate): string;
