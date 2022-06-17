import React, { useEffect, useState } from "react";
import ThreeLinks from "./links";
import { useWallet } from "../../hooks/useWallet";
import useNft from "../../hooks/useNft";
import LogoImage from "../../static/img/logo.jpg";
import { ReactComponent as Loading } from "../../static/svg/loading.svg";
import { toast } from "react-toastify";
import useBlockInterval from "../../hooks/useBlockInterval";

import "./index.css";

const truncate = (address) => {
  return address && address.slice(0, 4) + "..." + address.slice(-2);
};

const Home = () => {
  const { connect, walletInfo, isConnect, disConnect, networkChange, error } = useWallet();
  const { provider } = walletInfo;
  const [count, setCount] = useState(0);
  const [mintTotal, setMintTotal] = useState(0);

  const { isApprove, totalSupply, approve, txStatus, mint } = useNft();

  const handleChange = (e) => {
    const value = e.target.value;
    const NUMBER_REGEXP = /^[0-9]*$/;
    if (NUMBER_REGEXP.test(value)) {
      setCount(value);
    }
  };

  const add = () => {
    if (count < 3) {
      setCount(old => old + 1);
    }
  }

  const sub = () => {
    if (count > 0) {
      setCount(old => old - 1);
    }
  }

  useBlockInterval(async () => {
    const hasTotal = await totalSupply();
    setMintTotal(hasTotal)
  }, {provider, delayBlock: 3, leading: false})

  return (
    <div className="container h-full">
      <div className="flex justify-between pt-3 pl-5 pr-5">
        <img src={LogoImage} alt="LOGO" className="w-10 h-10" />

        <div className="flex gap-3 items-center">
          <ThreeLinks />
          {!isConnect && (
            <button className="text-[14px] py-2 px-2 md:py-3 md:px-3 rounded-md text-white border-2 border-white" onClick={connect}>
              连接钱包
            </button>
          )}
          {isConnect && (
            <>
              <span className="text-white">{truncate(walletInfo.address)}</span>
              {!error && <button className="text-[14px] py-2 px-2 md:py-3 md:px-3 rounded-md text-white border-2 border-white" onClick={disConnect}>断开连接</button>}
              {error && <button className="text-[14px] py-2 px-2 md:py-3 md:px-3 rounded-md text-white border-2 border-white" onClick={() => networkChange('bsc')}>切换BSC</button>}
            </>
          )}
        </div>
      </div>

      <div className="w-full h-[calc(100vh-57px)] flex flex-col justify-center items-center">
        <div className="w-[300px] md:w-[400px] h-[300px] rounded-md text-white flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-[20px] md:text-[24px] font-bold">铸造总量:</span>
            <span className="text-[20px] md:text-[24px] font-bold">{mintTotal}/2022</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[20px] md:text-[24px] font-bold">铸造价格:</span>
            <span className="text-[20px] md:text-[24px] font-bold">500E(BabyLaeeb)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[24px] font-bold">铸造数量:</span>
            <div className="flex items-center">
              <div className="symbol" onClick={sub}>
                 <span className="mt-[-1px]">-</span>
              </div>
              <input
                placeholder="请输入铸造数量"
                type="text"
                value={count}
                onChange={handleChange}
                className="w-10 h-4 bg-transparent border-none text-center"
              />
              <div className="symbol" onClick={add}>
                <span className="mt-[-1px]">+</span>
              </div>
            </div>
          </div>
          {
            !isApprove &&
            <button 
              className="py-4 px-3 w-full border-[1px] border-white border-solid rounded-md flex-center" 
              onClick={approve}
            >
              {txStatus.txLoading && <Loading className="loading mr-3" />}
              授权代币Token
            </button>
          }
          {
            isApprove &&
            <button 
              className="py-4 px-3 w-full border-[1px] border-white border-solid rounded-md flex-center"
              onClick={() => {
                if (count <= 0) {
                  toast.warn('请输入铸造数量至少为1');
                  return;
                }
                mint(count);
              }}
            >
              {txStatus.txLoading && <Loading className="loading mr-3" />}
              铸造
            </button>
          }
        </div>
      </div>
    </div>
  );
};

export default Home;
