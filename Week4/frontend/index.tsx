import {   createConfig,
  useAccount,
  useBalance,
  useContractRead,
  useContractWrite,
  useNetwork,
  useSignMessage,useSwitchNetwork,
usePrepareContractWrite} from "wagmi";
import { configureChains } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { mainnet, sepolia } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";
import styles from "./instructionsComponent.module.css";
import { useState,useEffect } from "react";
import {ethers} from "ethers"
import * as dotenv from 'dotenv';

export default function InstructionsComponent() {
  return (
    <div className={styles.container}>
      <header className={styles.header_container}>
        <div className={styles.header}>
          <h1>Week 4 Project</h1>
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
  const { chains,publicClient } = configureChains(
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
        {/* <p>Connected to the network {chain?.name}</p> */}
        {/* <WalletBalance address={address}></WalletBalance> */}
        {/* <WalletAction></WalletAction> */}
        <WinnerName></WinnerName>
        {/* <TokenBalance address={address}></TokenBalance> */}
        <RequestTokens address={address}></RequestTokens>
        <Vote address={address}></Vote>
        <GetBtcPrice></GetBtcPrice>
        <CastVote></CastVote>
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


function WinnerName() {
  
  const [winnerName, setWinnerName] = useState("");


    const fetchWinner = async () => {
      const provider = new ethers.JsonRpcProvider("");
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

function Vote(params:{address:`0x${string}`}) {
  const {config,error,isError}= usePrepareContractWrite({
    address: "0x895E11033225Dd644cbca8E1DD319bBcd6538208",

    abi : [{"inputs":[{"internalType":"bytes32[]","name":"proposalNames","type":"bytes32[]"},{"internalType":"address","name":"_tokenContract","type":"address"},{"internalType":"uint256","name":"_targetBlockNumber","type":"uint256"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"proposal","type":"uint256"},{"indexed":true,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"Vote","type":"event"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"proposals","outputs":[{"internalType":"bytes32","name":"name","type":"bytes32"},{"internalType":"uint256","name":"voteCount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"targetBlockNumber","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"tokenContract","outputs":[{"internalType":"contract IVoteToken","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"proposal","type":"uint256"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"votingPower","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"votingPowerSpent","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"winnerName","outputs":[{"internalType":"bytes32","name":"winnerName_","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"winningProposal","outputs":[{"internalType":"uint256","name":"winningProposal_","type":"uint256"}],"stateMutability":"view","type":"function"}]

      ,functionName:"vote",
      account:params.address,
       args: [1,1]
       
  })
  const{data,write} = useContractWrite(config)
  return (
    <div>
    <button disabled={!write} onClick={() => write()}>
      Vote
    </button>
    {isError && <div>Error: {error.message}</div>}
  </div>
  );
}

function GetBtcPrice(){
      const [btcPrice, setBtcPrice] = useState(null);
      const fetchPrice = async () => {
        const provider = new ethers.JsonRpcProvider("");
        const contractAddress = '0x4f4DF538e4384214E40C8D228B76c4B1150062c9';
        const abi = [
          {
            inputs: [
              {
                internalType: "address payable",
                name: "_tellorAddress",
                type: "address",
              },
            ],
            stateMutability: "nonpayable",
            type: "constructor",
          },
          {
            inputs: [{ internalType: "uint256", name: "maxTime", type: "uint256" }],
            name: "getBtcSpotPrice",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "bytes32", name: "_queryId", type: "bytes32" },
              { internalType: "uint256", name: "_timestamp", type: "uint256" },
            ],
            name: "getDataAfter",
            outputs: [
              { internalType: "bytes", name: "_value", type: "bytes" },
              {
                internalType: "uint256",
                name: "_timestampRetrieved",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "bytes32", name: "_queryId", type: "bytes32" },
              { internalType: "uint256", name: "_timestamp", type: "uint256" },
            ],
            name: "getDataBefore",
            outputs: [
              { internalType: "bytes", name: "_value", type: "bytes" },
              {
                internalType: "uint256",
                name: "_timestampRetrieved",
                type: "uint256",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "bytes32", name: "_queryId", type: "bytes32" },
              { internalType: "uint256", name: "_timestamp", type: "uint256" },
            ],
            name: "getIndexForDataAfter",
            outputs: [
              { internalType: "bool", name: "_found", type: "bool" },
              { internalType: "uint256", name: "_index", type: "uint256" },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "bytes32", name: "_queryId", type: "bytes32" },
              { internalType: "uint256", name: "_timestamp", type: "uint256" },
            ],
            name: "getIndexForDataBefore",
            outputs: [
              { internalType: "bool", name: "_found", type: "bool" },
              { internalType: "uint256", name: "_index", type: "uint256" },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "bytes32", name: "_queryId", type: "bytes32" },
              { internalType: "uint256", name: "_timestamp", type: "uint256" },
              { internalType: "uint256", name: "_maxAge", type: "uint256" },
              { internalType: "uint256", name: "_maxCount", type: "uint256" },
            ],
            name: "getMultipleValuesBefore",
            outputs: [
              { internalType: "bytes[]", name: "_values", type: "bytes[]" },
              { internalType: "uint256[]", name: "_timestamps", type: "uint256[]" },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [{ internalType: "bytes32", name: "_queryId", type: "bytes32" }],
            name: "getNewValueCountbyQueryId",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "bytes32", name: "_queryId", type: "bytes32" },
              { internalType: "uint256", name: "_timestamp", type: "uint256" },
            ],
            name: "getReporterByTimestamp",
            outputs: [{ internalType: "address", name: "", type: "address" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "bytes32", name: "_queryId", type: "bytes32" },
              { internalType: "uint256", name: "_index", type: "uint256" },
            ],
            name: "getTimestampbyQueryIdandIndex",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [],
            name: "idMappingContract",
            outputs: [
              {
                internalType: "contract IMappingContract",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "bytes32", name: "_queryId", type: "bytes32" },
              { internalType: "uint256", name: "_timestamp", type: "uint256" },
            ],
            name: "isInDispute",
            outputs: [{ internalType: "bool", name: "", type: "bool" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [
              { internalType: "bytes32", name: "_queryId", type: "bytes32" },
              { internalType: "uint256", name: "_timestamp", type: "uint256" },
            ],
            name: "retrieveData",
            outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [{ internalType: "address", name: "_addy", type: "address" }],
            name: "setIdMappingContract",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function",
          },
          {
            inputs: [],
            name: "tellor",
            outputs: [
              { internalType: "contract ITellor", name: "", type: "address" },
            ],
            stateMutability: "view",
            type: "function",
          },
          {
            inputs: [{ internalType: "bytes32", name: "_id", type: "bytes32" }],
            name: "valueFor",
            outputs: [
              { internalType: "int256", name: "_value", type: "int256" },
              { internalType: "uint256", name: "_timestamp", type: "uint256" },
              { internalType: "uint256", name: "_statusCode", type: "uint256" },
            ],
            stateMutability: "view",
            type: "function",
          },
        ];
        const contract = new ethers.Contract(contractAddress, abi, provider);
        const btcSpotPrice = await contract.getBtcSpotPrice(60 * 60 * 24 * 90);
        setBtcPrice(btcSpotPrice.toString());
        console.log(btcSpotPrice)
      }
    return (
      <div>
        <p>BtcPrice: {btcPrice}</p>
        <button onClick={() => fetchPrice()}>
          Get Btc Price
        </button>
      </div>
    );
    }

    function CastVote() {
      const [proposal, setProposal] = useState<number | undefined>();
      const [amount, setAmount] = useState("");
    
      const [data, setData] = useState<any>(null);
      const [isLoading, setLoading] = useState(false);
    
      if (isLoading) return <p>Voting...</p>;
    
      return (
        <div>
          <form>
            <label>
              Enter the proposal id you want to vote:
              <input
                type="number"
                value={proposal !== undefined ? proposal : ""}
                onChange={(e) => setProposal(parseInt(e.target.value))}
              />
            </label>
    
            <br />
            <label>
              Enter the amount:
              <input
                type="string"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </label>
          </form>
    
          <div>
            { !data && (
              <button
                disabled={isLoading}
                onClick={() => {
                  setLoading(true);
                  fetch(`http://localhost:3001/cast-vote/${proposal}/${amount}`)
                  .then((res) => res.json())
                  .then((data) => {
                    setData(data);
                    setLoading(false);
                  });
                }}
              >
                Vote
              </button>
            )}
          </div>
    
          <div>
            {data && (
              <div>
                <p>Voting {data.result ? "success" : "failed"}</p>
                <p>Transaction Hash: {data.txHash}</p>
              </div>
            )}
          </div>
    
        
        </div>
      )
    }