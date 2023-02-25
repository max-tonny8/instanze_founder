import { BigNumber } from "ethers";

interface ICampaign {
    owner: string;
    title: string;
    description: string;
    target:  string;
    deadline: number;
    amountCollected: string;
    image: string;
    id: number;
}

export type { ICampaign };
