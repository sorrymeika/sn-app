export class Sfs {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    /**
     * 补全sonofs文件地址
     * @param {string} size 100x100
     * @param {string} quantity 压缩质量：quantity-type，quantity：1～100，type: enum { 0: '仅原格式为jpg才压缩', 1: '导出jpeg', 2: 'accepts支持webp的导出webp，否则导出jpg' }
     */
    completeUrl = (src, size, quantity = '80') => {
        return !src
            ? null
            : /^(https?:)?\/\//.test(src)
                ? src
                : ((this.baseUrl + src) + '&o=' + [size, quantity].filter((o) => !!o).join(','));
    }
}