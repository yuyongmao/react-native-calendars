import { useCallback, useEffect, useRef, useState } from 'react';
import inRange from 'lodash/inRange';
import times from 'lodash/times';
import debounce from 'lodash/debounce';
import constants from '../commons/constants';
import { generateDay } from '../dateutils';
export const PAGES_COUNT = 100;
export const NEAR_EDGE_THRESHOLD = 10;
export const INITIAL_PAGE = Math.floor(PAGES_COUNT / 2);
const UseTimelinePages = ({ date, listRef, numberOfDays }) => {
    const pagesRef = useRef(times(PAGES_COUNT, i => {
        return generateDay(date, numberOfDays * (i - Math.floor(PAGES_COUNT / 2)));
    }));
    const [pages, setPages] = useState(pagesRef.current);
    const shouldResetPages = useRef(false);
    useEffect(() => {
        const updatedDays = times(PAGES_COUNT, i => {
            return generateDay(date, numberOfDays * (i - Math.floor(PAGES_COUNT / 2)));
        });
        pagesRef.current = updatedDays;
        setPages(updatedDays);
    }, [date, numberOfDays]);
    const isOutOfRange = useCallback((index) => {
        return !inRange(index, 0, PAGES_COUNT);
    }, []);
    const isNearEdges = useCallback(index => {
        return !inRange(index, NEAR_EDGE_THRESHOLD, PAGES_COUNT - NEAR_EDGE_THRESHOLD);
    }, []);
    const isOnEdgePages = useCallback(index => {
        return !inRange(index, 1, PAGES_COUNT - 1);
    }, []);
    const scrollToPage = useCallback((pageIndex) => {
        listRef.current?.scrollToOffset(pageIndex * constants.screenWidth, 0, false);
    }, [listRef]);
    const resetPages = (date) => {
        pagesRef.current = times(PAGES_COUNT, i => {
            return generateDay(date, numberOfDays * (i - Math.floor(PAGES_COUNT / 2)));
        });
        setPages(pagesRef.current);
        setTimeout(() => {
            scrollToPage(INITIAL_PAGE);
            shouldResetPages.current = false;
        }, 0);
    };
    return {
        resetPages: useCallback(resetPages, [numberOfDays, scrollToPage]),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        resetPagesDebounce: useCallback(debounce(resetPages, 500, { leading: false, trailing: true }), []),
        scrollToPage: useCallback(scrollToPage, [scrollToPage]),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        scrollToPageDebounce: useCallback(debounce(scrollToPage, 250, { leading: false, trailing: true }), [scrollToPage]),
        pagesRef,
        pages,
        shouldResetPages,
        isOutOfRange,
        isNearEdges,
        isOnEdgePages
    };
};
export default UseTimelinePages;
