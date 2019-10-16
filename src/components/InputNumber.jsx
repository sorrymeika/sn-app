import React from 'react';

export default function InputNumber({ className, value, min, max, onChange, ...props }) {
    return (
        <div className={"app-choose-number flex" + (className ? ' ' + className : '')}>
            <button
                className="minus iconfont icon-minus"
                disabled={min != null && value <= min}
                onClick={() => {
                    onChange(value - 1);
                }}
            ></button>
            <input
                className="num"
                {...props}
                type="tel"
                value={value}
                onChange={(e) => {
                    if (e.target.value == '') {
                        onChange('');
                    } else {
                        const newValue = Number(e.target.value);
                        if (isNaN(newValue) || (min != null && newValue < min) || (max != null && newValue > max)) {
                            e.target.value = value;
                        } else {
                            onChange(newValue);
                        }
                    }
                }}
                onBlur={(e) => {
                    if (e.target.value == '') {
                        onChange(1);
                    }
                }}
            />
            <button
                className="plus iconfont icon-plus"
                disabled={max != null && value >= max}
                onClick={() => {
                    onChange(value + 1);
                }}
            ></button>
        </div>
    );
}