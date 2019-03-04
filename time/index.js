export function subscribeTimeout(callback, timeout, thisArg, disposables) {
    const cb = !thisArg ? callback : callback.bind(thisArg);
    const id = setTimeout(cb, timeout);
    const result = {
        dispose() {
            clearTimeout(id);
        },
    };
    if (disposables && typeof disposables.push === 'function') {
        disposables.push(result);
    }
    return result;
}

export function subscribeInterval(callback, timeout, thisArg, disposables) {
    const cb = !thisArg ? callback : callback.bind(thisArg);
    const id = setInterval(cb, timeout);
    const result = {
        dispose() {
            clearInterval(id);
        },
    };
    if (disposables && typeof disposables.push === 'function') {
        disposables.push(result);
    }
    return result;
}
