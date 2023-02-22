import React from 'react';

function RangeSlider(props: any) {
  return (
    <div className="range-slider">
      <input type="range" min={props.min} max={props.max} value={props.value} onChange={props.onChange} />
    </div>
  );
}

export default RangeSlider;