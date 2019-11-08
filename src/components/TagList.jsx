import React from "react";

export default function TagList({
    className,
    value,
    dataSource,
    onChange
}) {
    return (
        <div className={"app_tag clearfix" + (className ? ' ' + className : '')}>
            {
                dataSource && dataSource.map(({ label, value: val }) => {
                    return (
                        <div
                            key={val}
                            className={"app_tag_item " + (value == val ? 'curr' : '')}
                            onClick={() => onChange(val)}
                        >{label}</div>
                    );
                })
            }
        </div>
    );
}