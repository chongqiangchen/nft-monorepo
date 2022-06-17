import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useWallet } from "./hooks/useWallet";
import HomePage from "./page/home";

function App() {
  const { connect, walletInfo, isConnect, disConnect } = useWallet();

  return (
    <div
      className="w-full h-[100vh] relative"
    >
      <div className="bg-black bg-opacity-50">
        <HomePage />
      </div>
    </div>
  );
}

export default App;
