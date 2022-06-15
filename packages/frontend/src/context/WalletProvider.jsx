import { BigNumber, ethers } from "ethers";
import React from "react";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const WalletContext = createContext(undefined);

const networks = {
    polygon: {
        chainId: `0x${Number(137).toString(16)}`,
        chainName: "Polygon Mainnet",
        nativeCurrency: {
            name: "MATIC",
            symbol: "MATIC",
            decimals: 18,
        },
        rpcUrls: ["https://polygon-rpc.com/"],
        blockExplorerUrls: ["https://polygonscan.com/"],
    },
    bsc: {
        chainId: `0x${Number(56).toString(16)}`,
        chainName: "BSC Mainnet",
        nativeCurrency: {
            name: "BNB",
            symbol: "BNB",
            decimals: 18,
        },
        rpcUrls: ["https://bsc-dataseed1.binance.org"],
        blockExplorerUrls: ["https://bscscan.io/"],
    },
    bscTestnet: {
        chainId: `0x${Number(97).toString(16)}`,
        chainName: "BSC Testnet",
        nativeCurrency: {
            name: "TBNB",
            symbol: "TBNB",
            decimals: 18,
        },
        rpcUrls: ["https://data-seed-prebsc-1-s1.binance.org:8545/"],
        blockExplorerUrls: ["https://testnet.bscscan.com/"],
    }
}

const networkChainIds = Object.keys(networks).map((key) => networks[key].chainId);

export const WalletProvider = ({ children }) => {
    const [walletInfo, setWalletInfo] = useState({
        address: null,
        balance: null,
    });
    const [error, setError] = useState(null);
    const [isSupported, setIsSupported] = useState(false);
    const [isConnect, setIsConnect] = useState(false);

    if (window.ethereum) {
        window.ethereum.on('chainChanged', (chainId) => {
            if (networkChainIds.includes(chainId)) {
                setError(null);
                setIsSupported(true);
            } else {
                setError(`Unsupported chainId: ${chainId}`);
                setIsSupported(false);
            }
        })

        window.ethereum.on('accountsChanged', () => {
            handleWalletConnect();
        })
    }

    const handleNetworkChange = async (networkType) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
            await provider.send("wallet_addEthereumChain", [{ ...networks[networkType] }]);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleWalletConnect = async () => {
        setError(null);

        if (window.ethereum) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            try {
                await provider.send("eth_requestAccounts", []);
                const wallet = provider.getSigner();
                const address = await wallet.getAddress();
                const balance = await wallet.getBalance();

                setWalletInfo({
                    address,
                    balance,
                });
                setIsConnect(true);
            } catch (error) {
                setError("Error Connecting Wallet...");
                setIsConnect(false);
            }
        }
    }

    const handleWalletDisConnect = async () => {
        if (window.ethereum) {
            setError(null);
            setWalletInfo({
                address: null,
                balance: null,
            });
            setIsConnect(false);
        }
    }

    useEffect(() => {
        if (error) toast.error(error);
    }, [error]);

    return (
        <WalletContext.Provider
            value={{
                walletInfo,
                isSupported,
                isConnect,
                networkChange: handleNetworkChange,
                connect: handleWalletConnect,
                disConnect: handleWalletDisConnect
            }}
        >
            {children}
        </WalletContext.Provider>
    )
}

export default WalletContext;

