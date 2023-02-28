import React, { useState, useEffect } from "react";

import DisplayCampaigns from "../components/DisplayCampaigns";
import getAddress from "../hooks/getAddress";
import {  useContract } from "@thirdweb-dev/react";
import { BigNumber, ethers } from "ethers";
import { ICampaign } from "../types/campaign";
import CustomButton from "../components/CustomButton";
import { Link, useNavigate } from "react-router-dom";
import { logo, menu, search } from "../assets";
import useConnect from "../hooks/useConnect";
import { navlinks } from "../constants/navLinks";
const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [campaigns, setCampaigns] = useState([]);
  const [toggleDrawer, setToggleDrawer] = useState(false);
  const [isActive, setIsActive] = useState("dashboard");
  const [searchValue, setSearchValue] = useState("");

  const connect = useConnect();

  const navigate = useNavigate();
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

  const fetchCampaigns = async () => {
    setIsLoading(true);
    const data = await getCampaigns();
    setCampaigns(data);
    setIsLoading(false);
  };

  useEffect(() => {
    if (contract) fetchCampaigns();
  }, [address, contract]);

  return (
    <>
    <div className="flex md:flex-row flex-col-reverse justify-between mb-[35px] gap-6">
        <div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[44px] bg-[#1c1c24] rounded-[100px]">
          <input
            type="text"
            placeholder="Search for campaigns"
            className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
  
          <div className="w-[64px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer">
            <img
              src={search}
              alt="search"
              className="w-[15px] h-[15px] object-contain"
            />
          </div>
        </div>
  
        <div className="sm:flex hidden flex-row justify-end gap-4">
          <CustomButton
            btnType="button"
            title={address ? "Create a campaign" : "Connect"}
            styles={address ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
            handleClick={() => {
              if (address) navigate("create-campaign");
              else connect()
            }}
          />
  
          <Link to="/profile">
            <div className="w-[40px] h-[40px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
              <img
                src={logo}
                alt="user"
                className="w-[60%] h-[60%] object-contain"
              />
            </div>
          </Link>
        </div>
  
        {/* Small screen navigation */}
        <div className="sm:hidden flex justify-between items-center relative">
          <div className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
            <img
              src={logo}
              alt="user"
              className="w-[60%] h-[60%] object-contain"
            />
          </div>
  
          <img
            src={menu}
            alt="menu"
            className="w-[30px] h-[30px] object-contain cursor-pointer"
            onClick={() => setToggleDrawer((prev) => !prev)}
          />
  
          <div
            className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${
              !toggleDrawer ? "-translate-y-[100vh]" : "translate-y-0"
            } transition-all duration-700`}
          >
            <ul className="mb-4">
              {navlinks.map((link) => (
                <li
                  key={link.name}
                  className={`flex p-4 ${
                    isActive === link.name && "bg-[#3a3a43]"
                  }`}
                  onClick={() => {
                    setIsActive(link.name);
                    setToggleDrawer(false);
                    navigate(link.link);
                  }}
                >
                  <img
                    src={link.imgUrl}
                    alt={link.name}
                    className={`w-[24px] h-[24px] object-contain ${
                      isActive === link.name ? "grayscale-0" : "grayscale"
                    }`}
                  />
                  <p
                    className={`ml-[20px] font-epilogue font-semibold text-[14px] ${
                      isActive === link.name ? "text-[#1dc071]" : "text-[#808191]"
                    }`}
                  >
                    {link.name}
                  </p>
                </li>
              ))}
            </ul>
  
            <div className="flex mx-4">
              <CustomButton
                btnType="button"
                title={address ? "Create a campaign" : "Connect"}
                styles={address ? "bg-[#1dc071]" : "bg-[#8c6dfd]"}
                handleClick={() => {
                  if (address) navigate("create-campaign");
                  else connect()
                }}
              />
            </div>
          </div>
        </div>
      </div>
    <DisplayCampaigns
      title="All Campaigns"
      isLoading={isLoading}
      campaigns={campaigns}
      search={searchValue}
    />
    </>
  );
};

export default Home;
