import React, { useEffect, useRef } from 'react';
/**
 * This hook avoid calling useEffect on the initial value of his dependency array
 */
export const useDidUpdate = (effectCallback, deps) => {
    const isMounted = useRef(false);
    useEffect(() => {
        if (isMounted.current) {
            effectCallback();
        }
        else {
            isMounted.current = true;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
};
export const useCombinedRefs = (...refs) => {
    const targetRef = React.useRef();
    React.useEffect(() => {
        refs.forEach(ref => {
            if (!ref) {
                return;
            }
            if (typeof ref === 'function') {
                ref(targetRef.current);
            }
            else {
                // @ts-expect-error
                ref.current = targetRef.current;
            }
        });
    }, [refs]);
    return targetRef;
};
