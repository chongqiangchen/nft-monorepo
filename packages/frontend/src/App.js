import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWallet } from "./hooks/useWallet";
import HomePage from "./page/home";

function App() {
  const { connect, walletInfo, isConnect, disConnect } = useWallet();

  return (
    <div className="container md:max-auto">
      {/* {!isConnect && <button className="btn btn-primary" onClick={connect}>连接钱包</button>}
      {isConnect && <button className="btn btn-primary" onClick={disConnect}>断开连接</button>}
      {isConnect && <div>当前账户：{walletInfo.address}</div>} */}
      <HomePage />
    </div>
  );
}

export default App;
