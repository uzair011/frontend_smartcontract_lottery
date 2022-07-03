import { useWeb3Contract } from "react-moralis"
import { abi, contractAddress } from "../Constants/index" //
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis() //
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddress ? contractAddress[chainId][0] : null

    // state hooks
    const [entranceFee, setEntranceFee] = useState("0")
    const [numOfPlayers, setNumOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")

    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        isLoading,
        isFetching,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayersFrontEnd } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const numberOfPlayersFromCall = (await getNumberOfPlayersFrontEnd()).toString()
        const recentWinnerFromCall = (await getRecentWinner()).toString()
        setEntranceFee(entranceFeeFromCall)
        setNumOfPlayers(numberOfPlayersFromCall)
        setRecentWinner(recentWinnerFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction complete",
            title: "Transaction Notificatioin",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async (transaction) => {
        await transaction.wait(1)
        handleNewNotification(transaction)
        updateUI()
    }

    return (
        <div className="p-5">
            Hello from LotteryEntrance
            <div className="">
                {raffleAddress ? (
                    <div className="">
                        <button
                            className="bg-blue-500 hover:bg-blue-800 text-white font-bold py-2 px-4 rounded ml-auto"
                            onClick={async () => {
                                await enterRaffle({
                                    onSuccess: handleSuccess,
                                    //onError: (error) => console.log(error),
                                })
                            }}
                            disabled={isLoading || isFetching}
                        >
                            {isLoading || isFetching ? (
                                <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full "></div>
                            ) : (
                                <div>Enter Raffle</div>
                            )}
                        </button>
                        <br />
                        <div>
                            Entrance fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                        </div>
                        <div>Number of players: {numOfPlayers}</div>
                        <div>Recent winner: {recentWinner}</div>
                    </div>
                ) : (
                    <div>No raffle address detected!!!</div>
                )}
            </div>
        </div>
    )
}
