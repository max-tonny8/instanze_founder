import { BigNumber } from "ethers";

interface ICreateCampaign {
  title: string;
  description: string;
  target: BigNumber;
  deadline: string | number | Date;
  image: string;
}

export type { ICreateCampaign };
