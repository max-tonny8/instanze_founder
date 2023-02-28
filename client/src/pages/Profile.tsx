import React, { useState, useEffect } from "react";

import DisplayCampaigns from "../components/DisplayCampaigns";
import getAddress from "../hooks/getAddress";
import { useContract } from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import { ICampaign } from "../types/campaign";
const Profile = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);

  const address = getAddress();
  const { contract } = useContract(
    "0x7b908acA75593E135d20273ee31318255f45b123"
  );

  const getCampaigns = async () => {
    const campaigns = await contract?.call("getCampaigns");

    const parsedCampaings = campaigns.map(
      (
        campaign: {
          owner: string;
          title: string;
          description: string;
          target: BigNumber;
          deadline: BigNumber;
          amountCollected: string;
          image: string;
          id: number;
        },
        index: number
      ) => ({
        owner: campaign.owner,
        title: campaign.title,
        description: campaign.description,
        target: ethers.utils.formatEther(campaign.target.toString()),
        deadline: campaign.deadline.toNumber(),
        amountCollected: ethers.utils.formatEther(
          campaign.amountCollected.toString()
        ),
        image: campaign.image,
        pId: index,
      })
    );

    return parsedCampaings;
  };

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns?.filter(
      (campaign: ICampaign) => campaign.owner === address
    );

    return filteredCampaigns;
  };

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getUserCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <>
    {
      address ? (<DisplayCampaigns
        title="My Campaigns"
        isLoading={isLoading}
        campaigns={campaigns}
        search=""
      />):(<h1 className="font-epilogue font-semibold text-[18px] text-white text-left">Please Connect your Wallet to see your campaigns</h1>)
    }
    </>
  );
};

export default Profile;
