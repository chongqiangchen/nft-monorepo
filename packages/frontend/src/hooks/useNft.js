import { useWallet } from "./useWallet";
import * as ethers from "ethers";
import ADDRESS from "../constants/address";
import NFT_ABI from "../constants/nft_abi";
import TOKEN_ABI from "../constants/token_abi";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";


const useNft = () => {
    const {walletInfo, isConnect, error} = useWallet();
    const {wallet, provider, address} = walletInfo;
    const nftContract = useRef();
    const tokenContract = useRef();
    const [txLoading, setTxLoading] = useState(false);
    const [txError, setTxError] = useState(null);
    
    const [tokenIsApprove, setTokenIsApprove] = useState(false);

    useEffect(() => {
        if (isConnect && !error) {
            const addressWithChainId = ADDRESS[provider.network.chainId];
            nftContract.current = new ethers.Contract(addressWithChainId.nft, NFT_ABI, wallet);
            tokenContract.current = new ethers.Contract(addressWithChainId.token, TOKEN_ABI, wallet);
        }
    }, [isConnect, address, provider && provider.network.chainId]);

    useEffect(() => {
        if (tokenContract.current) {
            (async () => {
                const tokenArroveState = await isApprove();
                setTokenIsApprove(tokenArroveState);
            })()
        }
    }, [tokenContract.current, address, provider && provider.network.chainId])

    useEffect(() => {
        if (txError) {
            if (String(txError).includes('reason="execution reverted: Amount bigger than allowed max mint!"')) {
                toast.error("铸造失败，铸造数量超过最大限制");
            } else if (String(txError).includes('reason="execution reverted: Not enough money!"')) {
                toast.error("铸造失败，余额不足");
            } else if (String(txError).includes('reason="execution reverted: Max supply exceeded!"')) {
                toast.error("铸造失败，铸造数量超过最大限制");
            } else if (String(txError).includes('reason="execution reverted: Mint is paused!"')) {
                toast.error("铸造失败，铸造未开始");
            } else {
                toast.error(String(txError).substring(0, 100));
            }
        }
    }, [txError])

    const isApprove = async () => {
        const tokenAllowanceBN = await tokenContract.current.allowance(address, ADDRESS[provider.network.chainId].nft);
        if (tokenAllowanceBN.gt(0)) {
            return true;
        }
        return false;
    }

    const approve = async () => {
        setTxLoading(true);
        try {
            const approveTx = await tokenContract.current.approve(ADDRESS[provider.network.chainId].nft, ethers.constants.MaxUint256);
            await approveTx.wait();
            setTokenIsApprove(true);
            toast.success("授权成功");
        } catch (error) {
            setTxError(error);
        }
        setTxLoading(false);
    }

    const mint = async (amount) =>  {
        setTxLoading(true);

        try {
            const balanceBN = await tokenContract.current.balanceOf(address);
            const cost = await nftContract.current.cost();
            
            if (balanceBN.lt(cost.mul(amount))) {
                setTxError("余额不足");
                return;
            }

            const gasLimit = await nftContract.current.estimateGas.mint(amount);
            const mintTx = await nftContract.current.mint(amount, {gasLimit});
            await mintTx.wait();
            toast.success("铸造成功");
        } catch (error) {
            setTxError(error);
        }
        setTxLoading(false);
    }


    const totalSupply = async () => {
        const totalSupplyBN = await nftContract.current.totalSupply();
        return totalSupplyBN.toString();
    }

    return {
        isApprove: tokenIsApprove,
        approve,
        mint,
        totalSupply,
        txStatus: {
            txLoading,
            txError
        }
    }
}

export default useNft;