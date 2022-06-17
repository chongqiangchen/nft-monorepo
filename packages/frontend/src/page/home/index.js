import React, { useState } from "react";
import { useWallet } from "../../hooks/useWallet";
import { LOGO_LIST } from "./constant";
import "./index.css";

const Home = () => {
  const { connect, walletInfo, isConnect, disConnect } = useWallet();
  const [surplusCount, setSurplusCount] = useState(0);
  const [count, setCount] = useState(0);

  const handleChange = (e) => {
    const value = e.target.value;
    const NUMBER_REGEXP = /^[0-9]*$/;
    if (NUMBER_REGEXP.test(value)) {
      setCount(value);
    }
  };
  return (
    <div className="home-container">
      <div className="top md:w-full pt-3 pl-5 pr-5">
        <div className="logo" />
        <div className="connect-button" onClick={connect}>
          连接钱包
        </div>
      </div>
      <div className="body md:w-full pt-60 pl-10 pr-10">
        <div className="content md:w-[400px] rounded pt-4 pl-8 pr-8 pb-4">
          <div>
            <span className="text">剩余数量:</span>
            {surplusCount}
          </div>
          <div>
            <span className="text">铸造数量:</span>
            <input
              placeholder="请输入铸造数量"
              type="text"
              value={count}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <button className="mint">铸造</button>
          </div>
        </div>
      </div>
      <div className="footer">
        {LOGO_LIST.map((i) => (
          <div className="footer-icon" onClick={() => window.open(i.url)}>
            {i.icon}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
