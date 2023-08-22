import { Component } from 'react';
import { TimelineEventProps, TimelineProps } from 'react-native-calendars';
export default class TimelineCalendarScreen extends Component {
    state: {
        currentDate: string;
        events: TimelineEventProps[];
        eventsByDate: {
            [key: string]: TimelineEventProps[];
        };
    };
    marked: {
        [x: string]: {
            marked: boolean;
        };
    };
    onDateChanged: (date: string) => void;
    onMonthChange: (month: any, updateSource: any) => void;
    createNewEvent: TimelineProps['onBackgroundLongPress'];
    approveNewEvent: TimelineProps['onBackgroundLongPressOut'];
    private timelineProps;
    render(): JSX.Element;
}
