import { util } from "snowball";
import { loader } from "snowball/widget";

export class Server {
    constructor({ baseUrl, app }) {
        this.app = app;
        this.baseUrl = baseUrl;
    }

    post(url, payload, options = {}) {
        const {
            isShowLoading,
            autoLogin = true
        } = options;

        isShowLoading && loader.showLoader();
        const complete = (result) => {
            isShowLoading && loader.hideLoader();
            if (process.env.NODE_ENV === 'development') {
                console.log('%crequest%c ' + url + ' %cresult:', 'border-radius:2px;padding:0 2px;background:blue;color:#fff', 'background:rgb(220, 242, 253);color: rgb(97, 140, 160)', 'background-color: rgb(220, 242, 253); color: rgb(97, 140, 160);', result);
            }
        };

        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            const success = (res) => {
                complete(res);
                if (res.success) {
                    resolve(res);
                } else if (res.code == 10002 && autoLogin) {
                    this.app.service.user.goToLogin({
                        onLogin: () => this.post(url, payload, options),
                        onCancelLogin: () => reject(res)
                    });
                } else {
                    reject(res);
                }
            };
            const error = (e) => {
                const err = e.target.status === 422
                    ? {
                        success: false,
                        code: -140,
                        message: '参数错误!'
                    }
                    : {
                        success: false,
                        code: e.target.status,
                        message: '网络错误!'
                    };
                complete(err);
                reject(err);
            };

            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    success(JSON.parse(xhr.responseText));
                } else {
                    error({ type: 'error', target: xhr });
                }
            });

            xhr.addEventListener('error', (e) => {
                if (xhr.status === 0) {
                    // 网络被页面跳转中断时等待600ms
                    setTimeout(() => {
                        error(e);
                    }, 600);
                } else {
                    error(e);
                }
            });

            xhr.open("POST", util.joinPath(this.baseUrl, url), true);
            xhr.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
            xhr.withCredentials = true;

            xhr.send(JSON.stringify(payload));
        });
    };
}
