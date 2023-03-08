import React, { useCallback, useEffect, useState, useRef } from "react";

// Range slider component for filtering by years

const MultiRangeSlider = ({ min, max, onChange, reset}: any) => {
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);
    const minValRef = useRef(min);
    const maxValRef = useRef(max);
    const range = useRef(null);

    //Array of all months in swedish. Used for displaying the months in the slider. Currently not in use.
    const monthArray = ["Jan", "Feb", "Mar", "Apr", "Maj", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];

    // Gets min and max values when their state changes.
    useEffect(() => {
        onChange({ min: minVal, max: maxVal });
    }, [minVal, maxVal, onChange]);

    useEffect(() => {
        if (reset) {
            setMinVal(min);
            setMaxVal(max);
        }
    }, [reset, min, max]);

    // Declares the styling classes and functionality of the range slider. Needs to be given min and max values, as well as onChange function to work.
    return (
        <div className="rangeSliderContainer">
            <input
                type="range"
                min={min}
                max={max}
                value={minVal}
                onChange={(event) => {
                    const value = (Number(event.target.value));
                    setMinVal(value);
                    minValRef.current = value;
                }}
                className="thumb thumb--left"
            />
            <input
                type="range"
                min={min}
                max={max}
                value={maxVal}
                onChange={(event) => {
                    const value = (Number(event.target.value));
                    setMaxVal(value);
                    maxValRef.current = value;
                }}
                className="thumb thumb--right"
            />

            <div className="slider">
                <div className="slider__track" />
                <div ref={range} className="slider__range" />
                <div className="slider__left-value">{minVal <= 12 && minVal <= maxVal ? monthArray[minVal - 1] :minVal <= 12 && minVal >= maxVal ? monthArray[maxVal - 1] :  minVal < maxVal ? minVal : maxVal}</div>
                <div className="slider__right-value">{maxVal <= 12 && maxVal >= minVal ? monthArray[maxVal - 1] :maxVal <= 12 && maxVal <= minVal ? monthArray[minVal - 1] : maxVal > minVal ? maxVal : minVal}</div>
            </div>
        </div>
    );
};

export default MultiRangeSlider;