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
import contractAddress from "./contractData";

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
        alchemyProvider({ apiKey: "" }),
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
          <BetFee></BetFee>
          <BetPrice></BetPrice>
          <BetsClosingTime></BetsClosingTime>
          <BetsOpen></BetsOpen>
          <GetRandomNumber></GetRandomNumber>
          <PaymentToken></PaymentToken>
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
      address: "0x387eE3A6EB285461B758FA86F5443c040ae96d4b",
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
    address: "0x387eE3A6EB285461B758FA86F5443c040ae96d4b",
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
    address: "0x387eE3A6EB285461B758FA86F5443c040ae96d4b",
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
    address: "0x387eE3A6EB285461B758FA86F5443c040ae96d4b",
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
    address: "0x387eE3A6EB285461B758FA86F5443c040ae96d4b",
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
    address: "0x387eE3A6EB285461B758FA86F5443c040ae96d4b",
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
    address: "0x387eE3A6EB285461B758FA86F5443c040ae96d4b",
    abi: contractABI,

    functionName: "paymentToken",
    onSuccess(data) {
      console.log("Success", data);
    },
    onError(error) {
      console.log("Error", error);
    },
  });

  const paymentToken = typeof data === "string" ? data : 0;

  if (isLoading) return <div>Fetching paymentToken....</div>;
  if (isError) return <div>Error fetching paymentToken</div>;
  return <div>Payment Token: {paymentToken}</div>;
}
