import React from "react";
import { inject } from "snowball/app";

function SfsImage({ completeUrl, src, size, quantity, type, ...props }) {
    if (src) {
        props.src = completeUrl(src, size, [quantity || 80, type].filter(opt => !!opt).join('-'));
    }
    return (
        <img alt="" {...props} />
    );
}

export default inject(({ ctx }) => ({
    completeUrl: ctx.sfs.completeUrl
}))(SfsImage);