import {
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useNetwork,
} from "wagmi";

import { sepolia } from "wagmi";
import { configureChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";
import styles from "./instructionsComponent.module.css";
import { useEffect, useState } from "react";
import contractABI from "./contractData";
import contractTokenABI from "./contractTokenData";



/**
 * @dev calls the Page Body
 */
export default function InstructionsComponent() {
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>Group 8 Lottery</h1>
        </div>
      </header>
      <p className={styles.get_started}>
        <PageBody></PageBody>
      </p>
    </div>
  );

  /**
   * @dev calls the Wallet Info
   */
  function PageBody() {
    return (
      <div>
        <WalletInfo></WalletInfo>
      </div>
    );
  }

  /**
   * contains the called components
   */
  function WalletInfo() {
    const { address, isConnecting, isDisconnected } = useAccount();
    const { chains, publicClient } = configureChains(
      [sepolia],
      [
        alchemyProvider({ apiKey: "PVsdQRGuGDwT2mm_Hs5ua-cepAVD0caw" }),
        publicProvider(),
      ]
    );

    if (address)
      return (
        <div>
          {chains && (
            <div>Available chains: {chains.map((chain) => chain.name)}</div>
          )}

          <p>Your account address is {address}</p>

          <WalletBalance address={address}></WalletBalance>
          <Owner></Owner>
          <PaymentToken></PaymentToken>
          <GetRandomNumber></GetRandomNumber>
          <BetFee></BetFee>
          <BetPrice></BetPrice>
          <CurrentTime></CurrentTime>
          <BetsClosingTime></BetsClosingTime>
          <BetsOpen></BetsOpen>
          <OpenBets></OpenBets>
          <Bet></Bet>
          <CloseLottery></CloseLottery>
          <OwnerWithdraw></OwnerWithdraw>
          <Mint></Mint>
        </div>
      );
    if (isConnecting)
      return (
        <div>
          <p>Loading...</p>
        </div>
      );
    if (isDisconnected)
      return (
        <div>
          <p>Wallet disconnected. Connect wallet to continue</p>
        </div>
      );
    return (
      <div>
        <p>Connect wallet to continue</p>
      </div>
    );
  }

  /**
   * @dev returns the wallet blance
   */
  function WalletBalance(params: { address: `0x${string}` }) {
    const { data, isError, isLoading } = useBalance({
      address: params.address,
    });

    if (isLoading) return <div>Fetching balance…</div>;
    if (isError) return <div>Error fetching balance</div>;
    return (
      <div>
        Balance: {data?.formatted} {data?.symbol}
      </div>
    );
  }

  /**
   * @notice returns the owner of the contract
   */
  function Owner() {
    const { data, isError, isLoading } = useContractRead({
      address: "0x504807971d8eE8717f5D1eB17206f664D95bAAdE",
      abi: contractABI,

      functionName: "owner",
      onSuccess(data) {
        console.log("Success", data);
      },
      onError(error) {
        console.log("Error", error);
      },
    });

    const owner = typeof data === "string" ? data : 0;

    if (isLoading) return <div>Fetching owner....</div>;
    if (isError) return <div>Error fetching owner</div>;
    return <div>Owner Address: {owner}</div>;
  }
}

function BetFee() {
  const { data, isError, isLoading } = useContractRead({
    address: "0x504807971d8eE8717f5D1eB17206f664D95bAAdE",
    abi: contractABI,

    functionName: "betFee",
    onSuccess(data) {
      console.log("Success", data);
    },

    onError(error) {
      console.log("Error", error);
    },
  });

  const betFee = typeof data === "bigint" ? (data as any).toString() : "N/A";

  if (isLoading) return <div>Fetching betFee....</div>;
  if (isError) return <div>Error fetching betFee</div>;
  return <div>Bet Fee: {betFee}</div>;
}

function BetPrice() {
  const { data, isError, isLoading } = useContractRead({
    address: "0x504807971d8eE8717f5D1eB17206f664D95bAAdE",
    abi: contractABI,

    functionName: "betPrice",
    onSuccess(data) {
      console.log("Success", data);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  const betPrice = typeof data === "bigint" ? (data as any).toString() : "N/A";

  if (isLoading) return <div>Fetching betPrice....</div>;
  if (isError) return <div>Error fetching betPrice</div>;
  return <div>Bet Price: {betPrice}</div>;
}

function BetsClosingTime() {
  const { data, isError, isLoading } = useContractRead({
    address: "0x504807971d8eE8717f5D1eB17206f664D95bAAdE",
    abi: contractABI,

    functionName: "betsClosingTime",
    onSuccess(data) {
      console.log("Success", data);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  const betsClosingTime =
    typeof data === "bigint" ? (data as any).toString() : "N/A";

  if (isLoading) return <div>Fetching betsClosingTime....</div>;
  if (isError) return <div>Error fetching betsClosingTime</div>;
  return <div>Bet Closing Time: {betsClosingTime}</div>;
}

function BetsOpen() {
  const { data, isError, isLoading } = useContractRead({
    address: "0x504807971d8eE8717f5D1eB17206f664D95bAAdE",
    abi: contractABI,

    functionName: "betsOpen",
    onSuccess(data) {
      console.log("Success", data);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  let betsOpen: string = "N/A";

  if (typeof data === "boolean") {
    betsOpen = (data as boolean).toString();
  } else if (Array.isArray(data)) {
    betsOpen = "Data is an array.";
  } else if (data === undefined) {
    betsOpen = "Data is undefined.";
  }

  if (isLoading) return <div>Fetching betsOpen....</div>;
  if (isError) return <div>Error fetching betsOpen</div>;
  return <div>Bets Open: {betsOpen}</div>;
}

function GetRandomNumber() {
  const { data, isError, isLoading } = useContractRead({
    address: "0x504807971d8eE8717f5D1eB17206f664D95bAAdE",
    abi: contractABI,

    functionName: "getRandomNumber",
    onSuccess(data) {
      console.log("Success", data);
      console.log("Type of data: ", typeof data);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  const getRandomNumber =
    typeof data === "bigint" ? (data as any).toString() : "N/A";

  if (isLoading) return <div>Fetching getRandomNumber....</div>;
  if (isError) return <div>Error fetching getRandomNumber</div>;
  return <div>Random Number: {getRandomNumber}</div>;
}

function PaymentToken() {
  const { data, isError, isLoading } = useContractRead({
    address: "0x524643cb1Db1a3467C613ad4E4fE9d4eede73F50",
    abi: contractTokenABI,

    functionName: "name",
    onSuccess(data) {
      console.log("Success", data);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  const name = typeof data === "string" ? data : 0;

  if (isLoading) return <div>Fetching paymentToken....</div>;
  if (isError) return <div>Error fetching paymentToken</div>;
  return <div>Payment Token: {name}</div>;
}


function OpenBets() {
  // Getting current timestamp in seconds
  const currentTimestamp = Math.floor(Date.now() / 1000);
  // Setting the future timestamp 20 minutes from now
  const betClosingTime = currentTimestamp + 20 * 60;

  const { data, isLoading, isSuccess, write, error } = useContractWrite({
    address: "0x504807971d8eE8717f5D1eB17206f664D95bAAdE",
    abi: contractABI,
    functionName: "openBets",
    account: "0x498AF4a8a9902E667EE8FfB1d064119eB27F9652",
  });

  return (
    <div>
      <button
        disabled={!write}
        onClick={() => 
          write({
            args: [betClosingTime],
          })
        }
      >
        OpenBets
      </button>
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
      {error && <div>Error: {JSON.stringify(error)}</div>}
    </div>
  );
}


function CloseLottery() {
 
  const { data, isLoading, isSuccess, write, error } = useContractWrite({
    address: "0x504807971d8eE8717f5D1eB17206f664D95bAAdE",
    abi: contractABI,
    functionName: "closeLottery",
    
  });

  return (
    <div>
      <button
        disabled={!write}
        onClick={() => 
          write({
            args: [],
          })
        }
      >
        Close Lottery
      </button>
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Closed Lottery TX: {JSON.stringify(data)}</div>}
      {error && <div>Error Closing Lottery: {JSON.stringify(error)}</div>}
    </div>
  );
}



function CurrentTime() {
  // Getting current timestamp in seconds
  const currentTimestamp = Math.floor(Date.now() / 1000);
    
  return (
    <div>
      <p>Current time is: {currentTimestamp}</p>
    </div>
  );
}


function Bet() {
 
  const { data, isLoading, isSuccess, write, error } = useContractWrite({
    address: "0x504807971d8eE8717f5D1eB17206f664D95bAAdE",
    abi: contractABI,
    functionName: "bet",
    
  });

  return (
    <div>
      <button
        disabled={!write}
        onClick={() => 
          write({
            args: [],
          })
        }
      >
        Place Bet!
      </button>
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Bet Placed!! TX: {JSON.stringify(data)}</div>}
      {error && <div>Error Placing Bet: {JSON.stringify(error)}</div>}
    </div>
  );
}

function OwnerWithdraw() {
 
  const [amount, setAmount] = useState(0); // Declare a new state variable 'amount'
  const { data, isLoading, isSuccess, write, error } = useContractWrite({
    address: "0x504807971d8eE8717f5D1eB17206f664D95bAAdE",
    abi: contractABI,
    functionName: "ownerWithdraw",
  });

  const handleWithdraw = () => {
    
    write({
      args: [amount], 
    });
  };

  return (
    <div>
      
      <input 
        type="text" 
        value={amount} 
        onChange={e => setAmount(parseInt(e.target.value))}        placeholder="Enter amount to withdraw"
      />

    
      <button
        disabled={!write}
        onClick={handleWithdraw}
      >
        Withdraw Amount
      </button>

      {/* Status Messages */}
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Owner Withdraw TX: {JSON.stringify(data)}</div>}
      {error && <div>Error Withdrawing: {JSON.stringify(error)}</div>}
    </div>
  );
}

function Mint() {
 
  const [amount, setAmount] = useState(0); 
  const [to, setTo] = useState("0x");
  const { data, isLoading, isSuccess, write, error } = useContractWrite({
    address: "0x524643cb1Db1a3467C613ad4E4fE9d4eede73F50",
    abi: contractTokenABI,
    functionName: "mint",
  });

  const handleMint = () => {
    
    write({
      args: [to, amount], 
    });
  };

  return (
    <div>

<input 
        type="text" 
        value={to} 
        onChange={e => setTo(e.target.value)}        
        placeholder="Enter address to mint to"
      />
      
      <input 
        type="text" 
        value={amount} 
        onChange={e => setAmount(parseInt(e.target.value))}        
        placeholder="Enter amount to mint"
      />

    
      <button
        disabled={!write}
        onClick={handleMint}
      >
        Mint lottery Tokens!!
      </button>

      {/* Status Messages */}
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Owner Mint TX: {JSON.stringify(data)}</div>}
      {error && <div>Error Minting: {JSON.stringify(error)}</div>}
    
    
      
    
    </div>
  );
}



