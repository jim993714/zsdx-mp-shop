export function formatMoney(money: number) {
    if (Number(money) < 10000) return money;
    return Number(money / 10000).toFixed(2) + '万';
}

export function calcContainerOffsetTop(instance: any, selector: string): Promise<number> {
    return new Promise(resolve => {
        const query = uni.createSelectorQuery().in(instance);
        query
            .select(selector)
            .boundingClientRect((data: any) => {
                resolve(data.top);
            })
            .exec();
    });
}
