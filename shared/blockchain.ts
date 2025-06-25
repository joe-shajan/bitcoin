import * as crypto from "crypto";

export interface Transaction {
  fromAddress: string;
  toAddress: string;
  amount: number;
  signature?: string;
}

class Block {
  constructor(
    public index: number,
    public timestamp: number,
    public transactions: Transaction[],
    public previousHash: string = "",
    public nonce: number = 0,
    public hash: string = ""
  ) {}

  calculateHash(): string {
    const data =
      this.index +
      this.timestamp +
      JSON.stringify(this.transactions) +
      this.previousHash +
      this.nonce;

    return crypto.createHash("sha256").update(data).digest("hex");
  }

  mineBlock(difficulty: number): void {
    this.hash = this.calculateHash();
    while (this.hash.substring(0, difficulty) !== "0".repeat(difficulty)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}

class Blockchain {
  private chain: Block[];
  private difficulty: number;

  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 2;
  }

  createGenesisBlock(): Block {
    const index = 0;
    const timestamp = 1718361600;
    const transactions = [
      { fromAddress: "0", toAddress: "1", amount: 100, signature: "" },
    ];
    const previousHash = "";
    const nonce = 0;

    const genesisBlock = new Block(
      index,
      timestamp,
      transactions,
      previousHash,
      nonce,
      "" // hash will be calculated later
    );
    genesisBlock.hash = genesisBlock.calculateHash();
    return genesisBlock;
  }

  addBlock(block: Block): void {
    block.previousHash = this.getLatestBlock().hash;
    block.mineBlock(this.difficulty);
    this.chain.push(block);
  }

  createBlock(transactions: Transaction[]) {
    const latest = this.getLatestBlock();
    return new Block(
      latest.index + 1,
      Date.now(),
      transactions,
      latest.hash,
      0,
      ""
    );
  }

  isChainValid(chain?: Block[]): boolean {
    const chainToCheck = chain || this.chain;
    for (let i = 1; i < chainToCheck.length; i++) {
      const currentBlock = chainToCheck[i];
      const previousBlock = chainToCheck[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  getDifficulty(): number {
    return this.difficulty;
  }

  replaceChain(newChain: Block[]): void {
    if (newChain.length <= this.chain.length) {
      console.log("Received chain is not longer than the current chain");
      return;
    }

    if (!this.isChainValid(newChain)) {
      console.log("❌ Received chain is invalid.");
      return;
    }

    console.log("🔁 Replacing chain with new longer valid chain.");
    this.chain = newChain;
  }

  getChain(): Block[] {
    return this.chain;
  }
}

export { Blockchain, Block };
