import { useAccount,useBalance,useNetwork } from "wagmi";
import styles from "./instructionsComponent.module.css";
import { useSignMessage } from "wagmi";
import { useState,useEffect } from "react";
import { useContractRead } from "wagmi";
import {ethers} from "ethers"
import * as dotenv from 'dotenv';



export default function InstructionsComponent() {
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>My App</h1>
        </div>
      </header>
      <p className={styles.get_started}>
        <PageBody></PageBody>
      </p>
    </div>
  );
}

function PageBody(){
  return (
    <div>
      <WalletInfo></WalletInfo>
    </div>
  )
}

function WalletInfo (){
  const { address, isConnecting, isDisconnected } = useAccount()
  const { chain } = useNetwork();

  if (address)
    return (
      <div>
        <p>Your account address is {address}</p>
        <p>Connected to the network {chain?.name}</p>
        <WalletBalance address={address}></WalletBalance>
        <WalletAction></WalletAction>
        <WinnerName></WinnerName>
        {/* <TokenBalance address={address}></TokenBalance> */}
        <RequestTokens address={address}></RequestTokens>
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

function WalletAction() {
  const [signatureMessage, setSignatureMessage] = useState("");

  const { data, isError, isLoading, isSuccess, signMessage } = useSignMessage();
  return (
    <div>
      <form>
        <label>
          Enter the message to be signed:
          <input
            type="text"
            value={signatureMessage}
            onChange={(e) => setSignatureMessage(e.target.value)}
          />
        </label>
      </form>
      <button
        disabled={isLoading}
        onClick={() =>
          signMessage({
            message: signatureMessage,
          })
        }
      >
        Sign message
      </button>
      {isSuccess && <div>Signature: {data}</div>}
      {isError && <div>Error signing message</div>}
    </div>
  );
}

function WalletBalance(params:{address:any}){
  const {data,isError,isLoading} = useBalance({address:params.address})
  if (isLoading) return <div>Fetching Balance</div>
  if(isError) return <div>Error Fetching Balance</div>
  return (<div>
  Balance : {data?.formatted} {data?.symbol}
  </div>)
}

function WinnerName() {
  
  const [winnerName, setWinnerName] = useState("");


    const fetchWinner = async () => {
      const provider = new ethers.JsonRpcProvider("RPC");
      const contractAddress = '0x275747A17ccb975C68F7708927D71Bb440B16fF8';
      const abi = [
        {
          "inputs": [
            {
              "internalType": "bytes32[]",
              "name": "proposalNames",
              "type": "bytes32[]"
            },
            {
              "internalType": "address",
              "name": "_tokenContract",
              "type": "address"
            }
          ],
          "stateMutability": "nonpayable",
          "type": "constructor"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "proposals",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "name",
              "type": "bytes32"
            },
            {
              "internalType": "uint256",
              "name": "voteCount",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "tokenContract",
          "outputs": [
            {
              "internalType": "contract IMyToken",
              "name": "",
              "type": "address"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [
            {
              "internalType": "uint256",
              "name": "proposal",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount",
              "type": "uint256"
            }
          ],
          "name": "vote",
          "outputs": [],
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "winnerName",
          "outputs": [
            {
              "internalType": "bytes32",
              "name": "winnerName_",
              "type": "bytes32"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        },
        {
          "inputs": [],
          "name": "winningProposal",
          "outputs": [
            {
              "internalType": "uint256",
              "name": "winningProposal_",
              "type": "uint256"
            }
          ],
          "stateMutability": "view",
          "type": "function"
        }
      
      ];
      const contract = new ethers.Contract(contractAddress, abi, provider);

      const winner = await contract.winnerName();
      const winnerName = ethers.toUtf8String(ethers.hexlify(winner));
      setWinnerName(winnerName);
    }

  return (
    <div>
      <p>Winner: {winnerName}</p>
      <button onClick={() => fetchWinner()}>
        Winner
      </button>

    </div>
  );
}

// function TokenBalance(params: { address: `0x${string}` }) {
//   const { data, isError, isLoading } = useContractRead({
//     address: "0x373BE6eABf54859701DfA846eA28B001850b72d6",
//   abi: [
//     {
//       "inputs": [],
//       "stateMutability": "nonpayable",
//       "type": "constructor"
//     },
//     {
//       "inputs": [],
//       "name": "InvalidShortString",
//       "type": "error"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "string",
//           "name": "str",
//           "type": "string"
//         }
//       ],
//       "name": "StringTooLong",
//       "type": "error"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "owner",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "spender",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "value",
//           "type": "uint256"
//         }
//       ],
//       "name": "Approval",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "delegator",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "fromDelegate",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "toDelegate",
//           "type": "address"
//         }
//       ],
//       "name": "DelegateChanged",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "delegate",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "previousBalance",
//           "type": "uint256"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "newBalance",
//           "type": "uint256"
//         }
//       ],
//       "name": "DelegateVotesChanged",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [],
//       "name": "EIP712DomainChanged",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "bytes32",
//           "name": "role",
//           "type": "bytes32"
//         },
//         {
//           "indexed": true,
//           "internalType": "bytes32",
//           "name": "previousAdminRole",
//           "type": "bytes32"
//         },
//         {
//           "indexed": true,
//           "internalType": "bytes32",
//           "name": "newAdminRole",
//           "type": "bytes32"
//         }
//       ],
//       "name": "RoleAdminChanged",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "bytes32",
//           "name": "role",
//           "type": "bytes32"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "account",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "sender",
//           "type": "address"
//         }
//       ],
//       "name": "RoleGranted",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "bytes32",
//           "name": "role",
//           "type": "bytes32"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "account",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "sender",
//           "type": "address"
//         }
//       ],
//       "name": "RoleRevoked",
//       "type": "event"
//     },
//     {
//       "anonymous": false,
//       "inputs": [
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "from",
//           "type": "address"
//         },
//         {
//           "indexed": true,
//           "internalType": "address",
//           "name": "to",
//           "type": "address"
//         },
//         {
//           "indexed": false,
//           "internalType": "uint256",
//           "name": "value",
//           "type": "uint256"
//         }
//       ],
//       "name": "Transfer",
//       "type": "event"
//     },
//     {
//       "inputs": [],
//       "name": "CLOCK_MODE",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "DEFAULT_ADMIN_ROLE",
//       "outputs": [
//         {
//           "internalType": "bytes32",
//           "name": "",
//           "type": "bytes32"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "DOMAIN_SEPARATOR",
//       "outputs": [
//         {
//           "internalType": "bytes32",
//           "name": "",
//           "type": "bytes32"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "MINTER_ROLE",
//       "outputs": [
//         {
//           "internalType": "bytes32",
//           "name": "",
//           "type": "bytes32"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "owner",
//           "type": "address"
//         },
//         {
//           "internalType": "address",
//           "name": "spender",
//           "type": "address"
//         }
//       ],
//       "name": "allowance",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "spender",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "amount",
//           "type": "uint256"
//         }
//       ],
//       "name": "approve",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "account",
//           "type": "address"
//         }
//       ],
//       "name": "balanceOf",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "account",
//           "type": "address"
//         },
//         {
//           "internalType": "uint32",
//           "name": "pos",
//           "type": "uint32"
//         }
//       ],
//       "name": "checkpoints",
//       "outputs": [
//         {
//           "components": [
//             {
//               "internalType": "uint32",
//               "name": "fromBlock",
//               "type": "uint32"
//             },
//             {
//               "internalType": "uint224",
//               "name": "votes",
//               "type": "uint224"
//             }
//           ],
//           "internalType": "struct ERC20Votes.Checkpoint",
//           "name": "",
//           "type": "tuple"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "clock",
//       "outputs": [
//         {
//           "internalType": "uint48",
//           "name": "",
//           "type": "uint48"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "decimals",
//       "outputs": [
//         {
//           "internalType": "uint8",
//           "name": "",
//           "type": "uint8"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "spender",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "subtractedValue",
//           "type": "uint256"
//         }
//       ],
//       "name": "decreaseAllowance",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "delegatee",
//           "type": "address"
//         }
//       ],
//       "name": "delegate",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "delegatee",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "nonce",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "expiry",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint8",
//           "name": "v",
//           "type": "uint8"
//         },
//         {
//           "internalType": "bytes32",
//           "name": "r",
//           "type": "bytes32"
//         },
//         {
//           "internalType": "bytes32",
//           "name": "s",
//           "type": "bytes32"
//         }
//       ],
//       "name": "delegateBySig",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "account",
//           "type": "address"
//         }
//       ],
//       "name": "delegates",
//       "outputs": [
//         {
//           "internalType": "address",
//           "name": "",
//           "type": "address"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "eip712Domain",
//       "outputs": [
//         {
//           "internalType": "bytes1",
//           "name": "fields",
//           "type": "bytes1"
//         },
//         {
//           "internalType": "string",
//           "name": "name",
//           "type": "string"
//         },
//         {
//           "internalType": "string",
//           "name": "version",
//           "type": "string"
//         },
//         {
//           "internalType": "uint256",
//           "name": "chainId",
//           "type": "uint256"
//         },
//         {
//           "internalType": "address",
//           "name": "verifyingContract",
//           "type": "address"
//         },
//         {
//           "internalType": "bytes32",
//           "name": "salt",
//           "type": "bytes32"
//         },
//         {
//           "internalType": "uint256[]",
//           "name": "extensions",
//           "type": "uint256[]"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "uint256",
//           "name": "timepoint",
//           "type": "uint256"
//         }
//       ],
//       "name": "getPastTotalSupply",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "account",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "timepoint",
//           "type": "uint256"
//         }
//       ],
//       "name": "getPastVotes",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "bytes32",
//           "name": "role",
//           "type": "bytes32"
//         }
//       ],
//       "name": "getRoleAdmin",
//       "outputs": [
//         {
//           "internalType": "bytes32",
//           "name": "",
//           "type": "bytes32"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "account",
//           "type": "address"
//         }
//       ],
//       "name": "getVotes",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "bytes32",
//           "name": "role",
//           "type": "bytes32"
//         },
//         {
//           "internalType": "address",
//           "name": "account",
//           "type": "address"
//         }
//       ],
//       "name": "grantRole",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "bytes32",
//           "name": "role",
//           "type": "bytes32"
//         },
//         {
//           "internalType": "address",
//           "name": "account",
//           "type": "address"
//         }
//       ],
//       "name": "hasRole",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "spender",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "addedValue",
//           "type": "uint256"
//         }
//       ],
//       "name": "increaseAllowance",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "to",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "amount",
//           "type": "uint256"
//         }
//       ],
//       "name": "mint",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "name",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "owner",
//           "type": "address"
//         }
//       ],
//       "name": "nonces",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "account",
//           "type": "address"
//         }
//       ],
//       "name": "numCheckpoints",
//       "outputs": [
//         {
//           "internalType": "uint32",
//           "name": "",
//           "type": "uint32"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "owner",
//           "type": "address"
//         },
//         {
//           "internalType": "address",
//           "name": "spender",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "value",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint256",
//           "name": "deadline",
//           "type": "uint256"
//         },
//         {
//           "internalType": "uint8",
//           "name": "v",
//           "type": "uint8"
//         },
//         {
//           "internalType": "bytes32",
//           "name": "r",
//           "type": "bytes32"
//         },
//         {
//           "internalType": "bytes32",
//           "name": "s",
//           "type": "bytes32"
//         }
//       ],
//       "name": "permit",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "bytes32",
//           "name": "role",
//           "type": "bytes32"
//         },
//         {
//           "internalType": "address",
//           "name": "account",
//           "type": "address"
//         }
//       ],
//       "name": "renounceRole",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "bytes32",
//           "name": "role",
//           "type": "bytes32"
//         },
//         {
//           "internalType": "address",
//           "name": "account",
//           "type": "address"
//         }
//       ],
//       "name": "revokeRole",
//       "outputs": [],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "bytes4",
//           "name": "interfaceId",
//           "type": "bytes4"
//         }
//       ],
//       "name": "supportsInterface",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "symbol",
//       "outputs": [
//         {
//           "internalType": "string",
//           "name": "",
//           "type": "string"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [],
//       "name": "totalSupply",
//       "outputs": [
//         {
//           "internalType": "uint256",
//           "name": "",
//           "type": "uint256"
//         }
//       ],
//       "stateMutability": "view",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "to",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "amount",
//           "type": "uint256"
//         }
//       ],
//       "name": "transfer",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     },
//     {
//       "inputs": [
//         {
//           "internalType": "address",
//           "name": "from",
//           "type": "address"
//         },
//         {
//           "internalType": "address",
//           "name": "to",
//           "type": "address"
//         },
//         {
//           "internalType": "uint256",
//           "name": "amount",
//           "type": "uint256"
//         }
//       ],
//       "name": "transferFrom",
//       "outputs": [
//         {
//           "internalType": "bool",
//           "name": "",
//           "type": "bool"
//         }
//       ],
//       "stateMutability": "nonpayable",
//       "type": "function"
//     }
//   ],
//     functionName: "balanceOf",
//     args: [params.address],
//   });

//   const balance = typeof data === "number" ? data : 0;

//   if (isLoading) return <div>Fetching balance…</div>;
//   if (isError) return <div>Error fetching balance</div>;
//   return <div>Balance: {balance}</div>;
// }

  function RequestTokens(params:{address:`0x${string}`}) {
    const [data, setData] = useState<any>("");
    const [isLoading, setLoading] = useState(false);
    const body = {address:params.address}
    
    const handleClick = () => {
      setLoading(true)
      fetch("http://localhost:3001/mint-tokens",{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(body),
      })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setData(data);
        setLoading(false);
      });
    };
    useEffect(() => {
      if (isLoading) {
        setData(""); // Reset data when loading starts
      }
    }, [isLoading]);
    
    if (isLoading) return <p>Minting Tokens...</p>;

    return (
      <div>
        <p>Tx Hash: {data.result}</p>
        <button onClick={handleClick}>
          Mint tokens
        </button>

      </div>
    );
  }

