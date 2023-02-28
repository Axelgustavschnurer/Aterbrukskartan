import React, { useCallback, useEffect, useState, useRef } from "react";

const MultiRangeSlider = ({ min, max, onChange }: any) => {
    const [minVal, setMinVal] = useState(min);
    const [maxVal, setMaxVal] = useState(max);
    const minValRef = useRef(min);
    const maxValRef = useRef(max);
    const range = useRef(null);

    // Convert to percentage
    const getPercent = useCallback(
        (value: any) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    // Get min and max values when their state changes
    useEffect(() => {
        onChange({ min: minVal, max: maxVal });
    }, [minVal, maxVal, onChange]);

    return (
        <div className="rangeSliderContainer">
            <input
                type="range"
                min={min}
                max={max}
                value={minVal}
                onChange={(event) => {
                    const value = Math.min(Number(event.target.value), maxVal - 1);
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
                    const value = Math.max(Number(event.target.value), minVal + 1);
                    setMaxVal(value);
                    maxValRef.current = value;
                }}
                className="thumb thumb--right"
            />

            <div className="slider">
                <div className="slider__track" />
                <div ref={range} className="slider__range" />
                <div className="slider__left-value">{minVal}</div>
                <div className="slider__right-value">{maxVal}</div>
            </div>
        </div>
    );
};

export default MultiRangeSlider;



// import React, { useState } from "react";
// import InputRange, { Range } from "react-input-range";
// import "react-input-range/lib/css/index.css";

// type DualRangeSliderProps = {
//     minValue: number;
//     maxValue: number;
//     step: number;
//     value: Range;
//     onChange: (value: Range) => void;
// };

// const DualRangeSlider: React.FC<DualRangeSliderProps> = ({
//     minValue,
//     maxValue,
//     step,
//     value,
//     onChange,
// }) => {
//     const [sliderValue, setSliderValue] = useState<Range>(value);

//     const handleOnChange = (value: Range) => {
//         setSliderValue(value);
//         onChange(value);
//     };

//     return (
//         <InputRange
//             minValue={minValue}
//             maxValue={maxValue}
//             step={step}
//             value={sliderValue}
//             onChange={handleOnChange}
//         />
//     );
// };

// export default DualRangeSlider;