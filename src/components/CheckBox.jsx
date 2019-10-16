import React from "react";

export default function CheckBox({ className, checked, onChange, onClick }) {
    return (
        <div onClick={onClick} className={"app-check" + (checked ? ' checked' : '') + (className ? ' ' + className : '')}>
            <i className="iconfont icon-right"></i>
        </div >
    );
}