# Delegate Function

## Posibility of loop in Delegation chain

  - In case of a loop/cycle in delegation chain, the function should revert the execution.
  
  - We provided right to vote for demonstrating the loop/cycle condition to this following three addresses :-
    * 0xdACdf692842ae754a040D9D0F1D86aEEEEF9BDF6 [Address 1]
    * 0x251b187103823180E27b2052EFc11EB344C72E2B [Address 2]
    * 0x66C52277289Bb354DE5C9c1b3cB8Df793BdD2bce [Address 3]

  - After providing right to vote these address can now vote or add a delegate to vote on their behalf.

  - ### First transaction - Address 1 adds Address 2 as delegate
    <img width="950" alt="image" src="https://github.com/AskBlockchain/Encode-HelloWorld/assets/85375791/4c792740-263f-4c13-a0a0-3f63458bca7b">

  - ### Second transaction - Address 2 adds Address 3 as delegate
    <img width="947" alt="image" src="https://github.com/AskBlockchain/Encode-HelloWorld/assets/85375791/47dce764-551f-4016-990b-8ee4c4261e0f">

  - ### Third transaction - Reverts When Address 3 tries to add Address 1 as delegate
    Revert message in remix terminal -
     > transact to Ballot.delegate errored: Returned error: {"jsonrpc":"2.0","error":__"execution reverted: Found loop in delegation."__,"id":7942531669002302}

## Posibility of revoting through delegate - Should revert the attempt

  ### Address - 0x251b187103823180E27b2052EFc11EB344C72E2B has already voted. When tried voting through delegate it reverts.
   > transact to Ballot.delegate errored: Returned error: {"jsonrpc":"2.0","error":__"execution reverted: You already voted__.","id":7942531669002897}

## Self delegation is another case that is handled inside this function

  ### When tried to add delegate vote by passing own address as delegate address in function parameter it reverts with following message.
   > transact to Ballot.delegate errored: Returned error: {"jsonrpc":"2.0","error":__"execution reverted: Self-delegation is disallowed."__,"id":7942531669002897}

  

  


  
  
  
