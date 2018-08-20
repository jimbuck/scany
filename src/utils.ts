
export function queueUp<T>(arr: Array<T>, count: number): Array<Array<T>> {
    if (count < 2) return [arr];

    let chunks: Array<Array<T>> = [];
    let maxSize = Math.ceil(arr.length / count);
    for (let i = 0, j = arr.length; i < j; i += maxSize) {
        chunks.push(arr.slice(i, i + maxSize));
    }
    return chunks;
}

export async function pTimes<T>(times: number, create: () => Promise<T>): Promise<Array<T>> {
    return await Promise.all(Array(times).fill(0).map(() => create()));
}

export async function pParallel<TItem, TResult>(items: Array<TItem>, work: (item: TItem, i: number) => Promise<TResult>): Promise<Array<TResult>> {
    return await Promise.all(items.map(async (x, i) => await work(x, i)));
}

export async function pSeries<TItem, TResult>(items: Array<TItem>, work: (item: TItem, i: number) => Promise<TResult>): Promise<Array<TResult>> {
    let p = Promise.resolve();
    let results: Array<TResult> = [];
    for (let i = 0; i < items.length; i++) {
        p = p.then(async () => {
            results.push(await work(items[i], i));
        });
    }

    await p;

    return results;
}