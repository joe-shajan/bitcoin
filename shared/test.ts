import { Blockchain, Block } from "./blockchain";

const myChain = new Blockchain();

console.log("Mining block 1...");
myChain.addBlock(
  new Block(
    1,
    Date.now(),
    [{ fromAddress: "A", toAddress: "B", amount: 10, signature: "" }],
    ""
  )
);

console.log("Mining block 2...");
myChain.addBlock(
  new Block(
    2,
    Date.now(),
    [{ fromAddress: "B", toAddress: "C", amount: 20, signature: "" }],
    ""
  )
);

console.log(JSON.stringify(myChain, null, 2));
console.log("Is chain valid?", myChain.isChainValid());
