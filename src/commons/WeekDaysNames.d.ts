import React from 'react';
import { StyleProp, TextStyle } from 'react-native';
interface WeekDaysNamesProps {
    firstDay?: number;
    style?: StyleProp<TextStyle>;
}
declare const WeekDaysNames: React.MemoExoticComponent<(props: WeekDaysNamesProps) => JSX.Element>;
export default WeekDaysNames;
