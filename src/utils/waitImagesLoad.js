
export default async function waitImagesLoad(el, autoLoadLazyImage = true) {
    if (!el) return;

    var imgs = el.querySelectorAll('img');
    if (imgs.length) {
        await Promise.all([].map.call(imgs, (img) => {
            return img.src && img.complete
                ? true
                : (img.__load_promise__ || (img.__load_promise__ = new Promise((resolve) => {
                    var isOk = false;
                    var ok = () => {
                        if (!isOk) {
                            isOk = true;
                            resolve();
                            img.onerror = img.onload = img.__load_promise__ = null;
                        }
                    };
                    img.onerror = img.onload = ok;
                    if (autoLoadLazyImage) {
                        var dataSrc = img.getAttribute('data-src');
                        if (dataSrc) {
                            img.src = dataSrc;
                            img.style.opacity = 1;
                            img.removeAttribute('data-src');
                        }
                    }
                    if (img.complete) {
                        ok();
                    } else {
                        setTimeout(ok, 3000);
                    }
                })));
        }));
    }
}
