import React, { useCallback, useEffect, useState, useRef } from "react";
import styles from "./dualSlider.module.css";
import { monthArray } from "@/pages/aterbruk";

/* MOVE TO ASIDE */

// Range slider component for filtering by years and months. Needs to be given min and max values, as well as onChange function to work.
const MultiRangeSlider = ({ min, max, onChange, reset }: any) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef(null);

  // Gets min and max values when their state changes.
  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  // Reset the slider(s) to it's default values upon reset being called externally.
  useEffect(() => {
    if (reset) {
      setMinVal(min);
      setMaxVal(max);
    }
  }, [reset, min, max]);

  // Declares the styling classes and functionality of the range slider. Needs to be given min and max values, as well as onChange function to work.
  return (
    <>
      {/* The slider thumb that starts at the left*/}
      <div className={styles.slider}>
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
          className={`${styles.thumb} ${styles.thumbLeft}`}
        />
        {/* The slider thumb that starts at the right*/}
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
          className={`${styles.thumb} ${styles.thumbRight}`}
        />
        {/* The slider track */}
        <div className={styles.sliderTrack} style={{ background: `linear-gradient(to right, lightGray 0 ${(Math.min(minVal, maxVal) - min) / (max - min) * 100}%, var(--accent) ${(Math.min(minVal, maxVal) - min) / (max - min) * 100}% ${(Math.max(minVal, maxVal) - min) / (max - min) * 100}%, lightGray ${(Math.max(minVal, maxVal) - min) / (max - min) * 100}% 100% )` }} />
        <div ref={range} className={styles.sliderRange} />
      </div>
      <div className={`display-flex justify-content-space-between ${styles.sliderValues}`}>
        {/* The values displayed at the left and right of the slider. 
                If the values are less than 12 we assume it's the slider for months and map the results to the monthArray. 
                Also keeps track of which value is larger for when the thumbs overlap*/}
        <p className={styles.sliderLeftValue}>{minVal <= 12 && minVal <= maxVal ? monthArray[minVal - 1] : minVal <= 12 && minVal >= maxVal ? monthArray[maxVal - 1] : minVal < maxVal ? minVal : maxVal}</p>
        <p className={styles.sliderRightValue}>{maxVal <= 12 && maxVal >= minVal ? monthArray[maxVal - 1] : maxVal <= 12 && maxVal <= minVal ? monthArray[minVal - 1] : maxVal > minVal ? maxVal : minVal}</p>
      </div>
    </>
  );
};

export default MultiRangeSlider;