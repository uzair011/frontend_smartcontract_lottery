import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../Constants/index"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null
    const [entranceFee, setEntranceFee] = useState("0")

    const { runContractFunction: enterRaffle } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRafle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    useEffect(() => {
        if (isWeb3Enabled) {
            async function updateUI() {
                const entranceFeeFromCall = (await getEntranceFee()).toString()
                setEntranceFee(entranceFeeFromCall)
            }
            updateUI()
        }
    }, [isWeb3Enabled])

    return (
        <div>
            Hello from LotteryEntrance
            <div>
                {raffleAddress ? (
                    <div>
                        <button
                            onClick={async function () {
                                await enterRaffle()
                            }}
                        >
                            Enter Raffle
                        </button>
                        Entrance fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                    </div>
                ) : (
                    <div>No raffle address detected!!!</div>
                )}
            </div>
        </div>
    )
}
