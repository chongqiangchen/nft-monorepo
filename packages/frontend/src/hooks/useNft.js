import { useWallet } from "./useWallet";
import * as ethers from "ethers";
import ADDRESS from "../constants/address";
import NFT_ABI from "../constants/nft_abi";
import TOKEN_ABI from "../constants/token_abi";
import { useEffect, useRef } from "react";


const useNft = () => {
    const {walletInfo, isConnect, error} = useWallet();
    const {wallet, provider} = walletInfo;
    const nftContract = useRef();
    const tokenContract = useRef();

    useEffect(() => {
        if (isConnect && !error) {
            const addressWithChainId = ADDRESS[provider.network.chainId];
            console.log(addressWithChainId);
            nftContract.current = new ethers.Contract(addressWithChainId.nft, NFT_ABI, wallet);
            tokenContract.current = new ethers.Contract(addressWithChainId.token, TOKEN_ABI, wallet);
        }
    }, [isConnect, provider && provider.network.chainId]);


    console.log(wallet, provider && provider.network.chainId);
}

export default useNft;