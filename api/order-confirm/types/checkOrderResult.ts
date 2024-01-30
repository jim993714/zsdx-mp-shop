export interface ToolLottery {
    lotteryNo: string;
}

export interface CheckLottery {
    toolLottery: ToolLottery;
    pennyBuyDiscountActivity: PennyBuyDiscountActivity;
}
export interface PennyBuyDiscountActivity {
    activityNo: string;
    alertImage: string;
    status: number;
}
