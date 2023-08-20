# Frontend Connecting to an Api

ERC20votes address:

TokenizedBallot address:


In this report, we document the process of connecting a frontend application to an API developed using Nest.js. The main objectives of this assignment were to create a decentralized voting application (dApp) that enables users to cast votes, delegate voting rights, and query voting results directly on the blockchain. Additionally, the frontend should allow users to request voting tokens to be minted using the API.


## Key Objectives:

1. Develop a voting dApp for voting, delegation, and result querying on the blockchain.
2. Implement a function to request voting tokens via the API.

  
## Request Tokens trough the API

  
To achieve the goal of requesting voting tokens through the API, we first built a frontend function that enables the minting of tokens upon button click. The function requires the user's address as a parameter, which is then passed to the backend via an API call.

Frontend Function:
```
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
```

Backend Controller (`app.controller.ts`):
```  
@Post("mint-tokens")
async mintTokens(@Body() body:MintTokenDto){
console.log({ body })
const result = await this.appService.mintTokens(body.address);
return result
}
}
```
Backend Service (`app.service.ts`):

```
async mintTokens(address:string) {

try{

const MINT_VALUE = ethers.parseUnits("1");

const mintTx = await this.contract.mint(address, MINT_VALUE);

await mintTx.wait();

console.log(

`Minted ${MINT_VALUE.toString()} decimal units to account ${

address

}`);

const balanceBN = await this.contract.balanceOf(address);

console.log(

`Account ${

address

} has ${balanceBN.toString()} decimals units of MyToken

`);

const txHash = mintTx.hash

console.log(mintTx.hash)

return {result:txHash};

}

catch(error){

console.log(error);

return {result:error};

}

}
```


## Queriyng from the frontend

For querying data from the `TokenizedBallot` contract, we implemented view functions that retrieve data from the blockchain and display it on the UI. Upon clicking a button, an instance of the contract is created with its address, ABI, and provider. The retrieved hex-encoded result is then converted to a human-readable format using the `ethers` library.

Frontend Querying Function for Winner Name:

```
function WinnerName() {

const [winnerName, setWinnerName] = useState("");

const fetchWinner = async () => {

const provider = new ethers.JsonRpcProvider("RPC");

const contractAddress = '0x275747A17ccb975C68F7708927D71Bb440B16fF8';

const abi = [...];

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
```

Function Querying for BTC spot price trought Tellor Oracle:
To ensure accurate and up-to-date data for the BTC spot price, we have implemented a function called `GetBtcPrice`. This function leverages the Tellor Oracle to retrieve the latest BTC spot price from the blockchain. Through the use of this function, we enable users to easily access real-time BTC spot price information.
```
function GetBtcPrice(){

const [btcPrice, setBtcPrice] = useState(null);

const fetchPrice = async () => {

const provider = new ethers.JsonRpcProvider("https://sepolia.gateway.pokt.network/v1/lb/85b2a06f");

const contractAddress = '0x4f4DF538e4384214E40C8D228B76c4B1150062c9';

const abi = [...];

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
```


# Vote Function

## Description

The Vote function is implemented through both the API and the user interface (UI). Users can cast their votes by interacting with the API, and they can also participate directly through the UI. This process involves passing the proposal index and the desired amount of tokens to vote. The entire flow is made by Nest.js on the backend and rendered on the frontend.

Frontend Function:

On the frontend, users can cast their votes using a simple and intuitive user interface. The UI consists of input fields for the proposal index and the voting amount. Once the user provides these inputs, they can click the "Vote" button to initiate the voting process. A loading status is displayed during the voting transaction.

```
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
```



Backend Controller (`app.controller.ts`):

In the backend, the API endpoint `/cast-vote/:proposal/:amount` handles voting requests. Users provide the proposal index and the amount of tokens they wish to vote. These parameters are extracted using the `@Param` decorator and then passed to the corresponding service function.
```
@Get('cast-vote/:proposal/:amount')

async castVote(

@Param('proposal') proposal: number,

@Param('amount') amount: string,

): Promise<any> {

console.log('Received proposal:', proposal);

console.log('Received amount:', amount);

return this.appService.castVote(proposal, amount);

}

}
```

Backend Service (`app.service.ts`):

The service function `castVote` receives the proposal index and the voting amount. It orchestrates the voting process by invoking the `vote` method from the contract. The method performs the vote and returns a transaction object. Upon successful completion of the transaction, the function returns the result along with the transaction hash.

```
async castVote(proposal: number, amount: string) {

console.log(`Voting to proposal ${proposal}...`);

const voteTx = await this.contract.vote(proposal, ethers.parseEther(amount));

const receipt = await voteTx.wait();

console.log(

`Voted to proposal ${proposal}! Transaction hash: ${receipt.hash}`,

);

  

return { result: true, txHash: receipt.hash };

}
```

Also we made a implementation using Rainbow kit and Wagmi Libraries for interact with the vote function from the ui, it takes 2 step as prepares the settings before interacting with the blockchain.

```
function Vote(params:{address:`0x${string}`}) {

const {config,error,isError}= usePrepareContractWrite({

address: "0x895E11033225Dd644cbca8E1DD319bBcd6538208",

const abi = [...];


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
```
