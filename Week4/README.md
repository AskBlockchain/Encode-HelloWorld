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

Frontend Querying Function:

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