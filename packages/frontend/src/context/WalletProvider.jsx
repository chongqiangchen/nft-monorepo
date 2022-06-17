import { BigNumber, ethers } from "ethers";
import React from "react";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

const WalletContext = createContext(undefined);

const networks = {
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
        provider: null,
        wallet: null,
    });
    const [error, setError] = useState(null);
    const [isSupported, setIsSupported] = useState(false);
    const [isConnect, setIsConnect] = useState(false);

    if (window.ethereum) {
        window.ethereum.on('chainChanged', (chainId) => {
            if (networkChainIds.includes(`0x${Number(chainId).toString(16)}`)) {
                setError(null);
                setIsSupported(true);
                handleWalletConnect()
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
                const { chainId } = await provider.getNetwork();
                if (!networkChainIds.includes(`0x${Number(chainId).toString(16)}`)) {
                    setError(`Unsupported chainId: ${chainId}`);
                    handleNetworkChange('bsc');
                }

                await provider.send("eth_requestAccounts", []);
                const wallet = provider.getSigner();
                const address = await wallet.getAddress();
                const balance = await wallet.getBalance();

                setWalletInfo({
                    address,
                    balance,
                    provider,
                    wallet,
                });
                setIsConnect(true);
            } catch (error) {
                setError("Error Connecting Wallet...");
                setIsConnect(false);
            }
        } else {
          setError("Metamask is not installed");
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
        console.log(error);
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
                disConnect: handleWalletDisConnect,
                error
            }}
        >
            {children}
        </WalletContext.Provider>
    )
}

export default WalletContext;

