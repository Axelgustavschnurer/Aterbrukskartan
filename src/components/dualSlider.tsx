import React, { useState } from "react";
import InputRange, { Range } from "react-input-range";
import "react-input-range/lib/css/index.css";

type DualRangeSliderProps = {
    minValue: number;
    maxValue: number;
    step: number;
    value: Range;
    onChange: (value: Range) => void;
};

const DualRangeSlider: React.FC<DualRangeSliderProps> = ({
    minValue,
    maxValue,
    step,
    value,
    onChange,
}) => {
    const [sliderValue, setSliderValue] = useState<Range>(value);

    const handleOnChange = (value: Range) => {
        setSliderValue(value);
        onChange(value);
    };

    return (
        <InputRange
            minValue={minValue}
            maxValue={maxValue}
            step={step}
            value={sliderValue}
            onChange={handleOnChange}
        />
    );
};

export default DualRangeSlider;