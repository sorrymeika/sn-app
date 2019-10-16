import { $, EventEmitter } from "snowball";
import waitImagesLoad from "../utils/waitImagesLoad";

const ANCHOR_NOTFOUND = "anchor_notfound";
const emitter = new EventEmitter();

export function appExtentions(ctx) {
    async function checkLoginStatus(element) {
        if (element.getAttribute('app-should-login') !== null) {
            if (!await ctx.user.isLogin()) {
                if (!await ctx.user.login(element.getAttribute('app-link'))) {
                    return false;
                }
            }
        }
        return true;
    }

    function transitionTo(url) {
        if (/^(https?:)?\/\//.test(url)) {
            location.href = url;
        } else {
            ctx.navigation.forward(url);
        }
    }

    function transitionToLinkAttrOf(element) {
        var url = element.getAttribute('app-link');
        if (!url) return;

        if (url.charAt(0) == '@') {
            var scrollView;
            for (var parent = element; parent; parent = parent.parentNode) {
                if (parent.__widget_scroll__) {
                    scrollView = parent;
                    break;
                }
            }

            if (scrollView && scrollView.__widget_scroll__) {
                var anchor = scrollView.querySelector('[app-anchor-name="' + url + '"]');
                if (anchor) {
                    scrollToAnchor(anchor, scrollView);
                } else {
                    emitter.trigger(new Event(ANCHOR_NOTFOUND, {
                        target: element,
                        anchorName: url
                    }), scrollView);
                }
            }
        } else {
            transitionTo(url);
        }
    }

    async function scrollToAnchor(anchor, scrollView, offsetTop = 50) {
        await waitImagesLoad(scrollView);

        var top = 0;
        for (var node = anchor; node && node != scrollView; node = node.offsetParent) {
            top += node.offsetTop;
        }

        top -= offsetTop;

        scrollView.__widget_scroll__.scrollTo(0, Math.max(0, top), 200);
    }

    return {
        /**
         * 给element加钩子，统一处理某些app级别的特殊属性
         * [app-forward] 页面跳转链接(前进动画)
         * [app-back] 页面跳转链接(返回动画)
         * [app-link] 页面跳转链接(根据history决定使用前进还是返回动画)
         * [app-should-login] 链接跳转时是否需要登录
         * @param {HtmlElement} element
         */
        initDomEventHooks: (element) => {
            // 处理页面跳转相关标签属性
            $(element)
                .on('click', '[app-forward]', function (e) {
                    var url = e.currentTarget.getAttribute('app-forward');
                    url && ctx.navigation.forward(url);
                })
                .on('click', '[app-back]', function (e) {
                    var url = e.currentTarget.getAttribute('app-back');
                    url && ctx.navigation.back(url);
                })
                .on('click', '[app-link]', async function (e) {
                    e.stopPropagation();
                    if (!await checkLoginStatus(e.currentTarget)) return;
                    transitionToLinkAttrOf(e.currentTarget);
                })
                .on('click', 'a', function (e) {
                    var href = e.currentTarget.href;
                    if (!href) return false;

                    if (!/^(javascript|mailto|tel):/.test(href)) {
                        var element = e.currentTarget;
                        (async () => {
                            if (!await checkLoginStatus(element)) return;
                            transitionTo(href);
                        })();
                        return false;
                    }
                });
        },

        scrollToAnchor,

        transitionTo
    };
}
