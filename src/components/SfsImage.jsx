import React from "react";
import { inject } from "snowball/app";

/**
 * sonofs图片
 * @param {*} props
 * @param {*} props.type 类型： enum { 0: '仅原格式为jpg才压缩', 1: '导出jpeg', 2: '支持webp的导出webp，否则导出jpg' }
 */
function SfsImage({ completeUrl, src, size, quantity, type = 0, ...props }) {
    if (src) {
        props.src = completeUrl(src, size, [quantity || 80, type].filter(opt => !!opt).join('-'));
    }
    return (
        <img alt="" {...props} />
    );
}

export default inject(({ ctx }) => ({
    completeUrl: ctx.app.sfs.completeUrl
}))(SfsImage);