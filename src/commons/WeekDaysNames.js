import React from 'react';
import { Text } from 'react-native';
import { weekDayNames } from '../dateutils';
const WeekDaysNames = React.memo((props) => {
    const { firstDay, style } = props;
    const dayNames = weekDayNames(firstDay);
    return (<>
      {dayNames.map((day, index) => (<Text allowFontScaling={false} key={index} style={style} numberOfLines={1} accessibilityLabel={''}>
        {day}
        </Text>))}
    </>);
});
WeekDaysNames.displayName = 'WeekDaysNames';
export default WeekDaysNames;
