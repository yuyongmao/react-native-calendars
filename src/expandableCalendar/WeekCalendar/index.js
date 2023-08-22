import XDate from 'xdate';
import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { sameWeek, onSameDateRange } from '../../dateutils';
import { toMarkingFormat } from '../../interface';
import styleConstructor from '../style';
import WeekDaysNames from '../../commons/WeekDaysNames';
import Week from '../week';
import { UpdateSources } from '../commons';
import constants from '../../commons/constants';
import { extractCalendarProps } from '../../componentUpdater';
import CalendarContext from '../Context';
import { useDidUpdate } from '../../hooks';
export const NUMBER_OF_PAGES = 6;
const NUM_OF_ITEMS = NUMBER_OF_PAGES * 2 + 1; // NUMBER_OF_PAGES before + NUMBER_OF_PAGES after + current
const APPLY_ANDROID_FIX = constants.isAndroid && constants.isRTL;
const VIEWABILITY_CONFIG = { itemVisiblePercentThreshold: 20 }; // 50 means if 50% of the item is visible
/**
 * @description: Week calendar component
 * @note: Should be wrapped with 'CalendarProvider'
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/expandableCalendar.js
 */
const WeekCalendar = (props) => {
    const { 
    // eslint-disable-next-line react/prop-types
    calendarWidth, 
    // eslint-disable-next-line react/prop-types
    hideDayNames, 
    // eslint-disable-next-line react/prop-types
    current, 
    // eslint-disable-next-line react/prop-types
    theme, 
    // eslint-disable-next-line react/prop-types
    testID, } = props;
    const context = useContext(CalendarContext);
    const { allowShadow = true, ...calendarListProps } = props;
    const { style: propsStyle, onDayPress, firstDay = 0, ...others } = extractCalendarProps(calendarListProps);
    const { date, numberOfDays, updateSource, setDate, timelineLeftInset } = context;
    const visibleWeek = useRef(date);
    const style = useRef(styleConstructor(theme));
    const items = useRef(getDatesArray(current ?? date, firstDay, numberOfDays));
    const [listData, setListData] = useState(items.current);
    const changedItems = useRef(constants.isRTL);
    const list = useRef(null);
    const currentIndex = useRef(NUMBER_OF_PAGES);
    const onEndReached = useCallback(() => {
        changedItems.current = true;
        items.current = getDatesArray(visibleWeek.current, firstDay, numberOfDays);
        setListData(items.current);
        currentIndex.current = NUMBER_OF_PAGES;
        list?.current?.scrollToIndex({ index: NUMBER_OF_PAGES, animated: false });
    }, [firstDay, numberOfDays]);
    // Refs to provide indirect/stable dependencies to onViewableItemsChanged to satisfy FlatList immutability requirement.
    const setDateRef = useRef(setDate);
    setDateRef.current = setDate; // always set the current value
    const onEndReachedRef = useRef(onEndReached);
    onEndReachedRef.current = onEndReached; // always set the current value
    useDidUpdate(() => {
        items.current = getDatesArray(date, firstDay, numberOfDays);
        setListData(items.current);
        visibleWeek.current = date;
    }, [date, firstDay, numberOfDays]);
    useDidUpdate(() => {
        if (updateSource !== UpdateSources.WEEK_SCROLL) {
            const pageIndex = items.current.findIndex(item => isCustomNumberOfDays(numberOfDays) ?
                onSameDateRange({
                    firstDay: item,
                    secondDay: date,
                    numberOfDays: numberOfDays,
                    firstDateInRange: item
                }) :
                sameWeek(item, date, firstDay));
            if (pageIndex !== currentIndex.current) {
                if (pageIndex >= 0) {
                    visibleWeek.current = items.current[pageIndex];
                    currentIndex.current = pageIndex;
                }
                else {
                    visibleWeek.current = date;
                    currentIndex.current = NUMBER_OF_PAGES;
                }
                pageIndex <= 0 ? onEndReached() : list?.current?.scrollToIndex({ index: pageIndex, animated: false });
            }
        }
    }, [date, firstDay, numberOfDays, onEndReached, updateSource]);
    const containerWidth = useMemo(() => {
        return calendarWidth ?? constants.screenWidth;
    }, [calendarWidth]);
    const _onDayPress = useCallback((value) => {
        if (onDayPress) {
            onDayPress(value);
        }
        else {
            setDate?.(value.dateString, UpdateSources.DAY_PRESS);
        }
    }, [onDayPress, setDate]);
    const weekStyle = useMemo(() => {
        return [{ width: containerWidth }, propsStyle];
    }, [containerWidth, propsStyle]);
    const renderItem = useCallback(({ item }) => {
        const currentContext = sameWeek(date, item, firstDay) ? context : undefined;
        return (<Week {...others} current={item} firstDay={firstDay} style={weekStyle} context={currentContext} onDayPress={_onDayPress} numberOfDays={numberOfDays} timelineLeftInset={timelineLeftInset}/>);
    }, [date, firstDay, context, others, weekStyle, _onDayPress, numberOfDays, timelineLeftInset]);
    const keyExtractor = useCallback((item) => item, []);
    const renderWeekDaysNames = useMemo(() => {
        return (<WeekDaysNames firstDay={firstDay} style={style.current.dayHeader}/>);
    }, [firstDay]);
    const weekCalendarStyle = useMemo(() => {
        return [
            allowShadow && style.current.containerShadow,
            !hideDayNames && style.current.containerWrapper
        ];
    }, [allowShadow, hideDayNames]);
    const containerStyle = useMemo(() => {
        return [style.current.week, style.current.weekCalendar];
    }, []);
    const getItemLayout = useCallback((_, index) => {
        return {
            length: containerWidth,
            offset: containerWidth * index,
            index
        };
    }, [containerWidth]);
    const onViewableItemsChanged = useCallback(({ viewableItems }) => {
        if (changedItems.current || viewableItems.length === 0) {
            changedItems.current = false;
            return;
        }
        const currItems = items.current;
        const newDate = viewableItems[0]?.item;
        if (newDate !== visibleWeek.current) {
            if (APPLY_ANDROID_FIX) {
                //in android RTL the item we see is the one in the opposite direction
                const newDateOffset = -1 * (NUMBER_OF_PAGES - currItems.indexOf(newDate));
                const adjustedNewDate = currItems[NUMBER_OF_PAGES - newDateOffset];
                visibleWeek.current = adjustedNewDate;
                currentIndex.current = currItems.indexOf(adjustedNewDate);
                setDateRef.current(adjustedNewDate, UpdateSources.WEEK_SCROLL);
                if (visibleWeek.current === currItems[currItems.length - 1]) {
                    onEndReachedRef.current();
                }
            }
            else {
                currentIndex.current = currItems.indexOf(newDate);
                visibleWeek.current = newDate;
                setDateRef.current(newDate, UpdateSources.WEEK_SCROLL);
                if (visibleWeek.current === currItems[0]) {
                    onEndReachedRef.current();
                }
            }
        }
    }, []); // NOTE: There must be no dependencies and no NEED for a dependency here, as FlatList does not allow any changes to onViewableItemsChanged with the same key prop after mounting!
    return (<View testID={testID} style={weekCalendarStyle}>
      {!hideDayNames && (<View style={containerStyle}>
          {renderWeekDaysNames}
        </View>)}
      <View style={style.current.container}>
          <FlatList testID={`${testID}.list`} ref={list} style={style.current.container} data={listData} horizontal showsHorizontalScrollIndicator={false} pagingEnabled scrollEnabled renderItem={renderItem} keyExtractor={keyExtractor} initialScrollIndex={NUMBER_OF_PAGES} getItemLayout={getItemLayout} onViewableItemsChanged={onViewableItemsChanged} viewabilityConfig={VIEWABILITY_CONFIG} onEndReached={onEndReached} onEndReachedThreshold={1 / NUM_OF_ITEMS}/>
      </View>
    </View>);
};
function getDateForDayRange(date, weekIndex, numberOfDays) {
    const d = new XDate(date);
    if (weekIndex !== 0) {
        d.addDays(numberOfDays * weekIndex);
    }
    return toMarkingFormat(d);
}
function getDate(date, firstDay, weekIndex) {
    const d = new XDate(date);
    // get the first day of the week as date (for the on scroll mark)
    let dayOfTheWeek = d.getDay();
    if (dayOfTheWeek < firstDay && firstDay > 0) {
        dayOfTheWeek = 7 + dayOfTheWeek;
    }
    // leave the current date in the visible week as is
    const dd = weekIndex === 0 ? d : d.addDays(firstDay - dayOfTheWeek);
    const newDate = dd.addWeeks(weekIndex);
    return toMarkingFormat(newDate);
}
/**
 * Exported only for testing.
 */
export function getDatesArray(date, firstDay, numberOfDays) {
    return [...Array(NUM_OF_ITEMS).keys()].map((index) => {
        if (isCustomNumberOfDays(numberOfDays)) {
            return getDateForDayRange(date, index - NUMBER_OF_PAGES, numberOfDays);
        }
        return getDate(date, firstDay, index - NUMBER_OF_PAGES);
    });
}
function isCustomNumberOfDays(numberOfDays) {
    return numberOfDays && numberOfDays > 1;
}
WeekCalendar.displayName = 'WeekCalendar';
export default WeekCalendar;
