export function sleep(ms: number): Promise<void> {
    return new Promise(resolve => {
        setTimeout(() => {
        resolve();
        }, ms);
    })
}

export function sleepTilTheFiveMinuteMarker(date = new Date()) {
    const sleepTil = new Date(date);
    sleepTil.setMinutes(date.getMinutes() + (5 - date.getMinutes() % 5));

    // add an extra 100ms to be sure
    sleepTil.setMilliseconds(sleepTil.getMilliseconds() + 500);

    return sleep(Math.max(0, sleepTil.getTime() - new Date().getTime() ));
}

export function today(): Date {
    const res = new Date();
    res.setHours(0,0,0,0);
    return res;
}

export function yesterday(): Date {
    const res = today();
    res.setDate(res.getDate() - 1);
    return res;
}

export function tomorrow(): Date {
    const res = today();
    res.setDate(res.getDate() + 1);
    return res;
}