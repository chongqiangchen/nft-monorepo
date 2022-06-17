import HomePage from "./page/home";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ToastContainer limit={1} className="translate-y-[100px]" />
      <div
        className="w-full h-[100vh] relative"
      >
        <div className="bg-black bg-opacity-50">
          <HomePage />
        </div>
      </div>

    </>
  );
}

export default App;
