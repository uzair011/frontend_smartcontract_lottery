import { useMoralis } from "react-moralis"
import { useEffect } from "react"

export default function ManualHeader() {
    const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading } =
        useMoralis()

    useEffect(() => {
        if (isWeb3Enabled) return
        if (typeof window !== "undefined") {
            if (window.localStorage.getItem("Connected")) {
                enableWeb3()
            }
        }
    }, [isWeb3Enabled])

    useEffect(() => {
        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`) // changing accounts...
            if (account == null) {
                window.localStorage.removeItem("Connected")
                deactivateWeb3()
                console.log(`null account found`)
            }
        })
    }, [])

    return (
        <div>
            {account ? (
                <div>
                    {/* showing the account number */}
                    Connected to {account.slice(0, 6)}...{account.length - 4}
                </div>
            ) : (
                // connecting to the wallet
                <button
                    onClick={async () => {
                        if (typeof window != "undefined") {
                            window.localStorage.setItem("Connected", "Injected")
                        }
                        enableWeb3()
                    }}
                    disabled={isWeb3EnableLoading} // disabling the connect button while loading
                >
                    Connect
                </button>
            )}
        </div>
    )
}
