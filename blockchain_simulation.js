const crypto = require('crypto');

class Transaction {
  constructor(sender, receiver, amount) {
    this.sender = sender;
    this.receiver = receiver;
    this.amount = amount;
  }

  toString() {
    return `${this.sender} -> ${this.receiver}: ${this.amount}`;
  }
}

class Block {
  constructor(index, transactions, previousHash = '') {
    this.index = index;
    this.timestamp = new Date().toISOString();
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.computeHash();
  }

  computeHash() {
    const data = this.index + this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  mineBlock(difficulty = 2) {
    const prefix = Array(difficulty + 1).join('0');
    while (!this.hash.startsWith(prefix)) {
      this.nonce++;
      this.hash = this.computeHash();
    }
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  createGenesisBlock() {
    return new Block(0, [], '0');
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newTransactions) {
    const newBlock = new Block(
      this.chain.length,
      newTransactions,
      this.getLatestBlock().hash
    );
    newBlock.mineBlock();
    this.chain.push(newBlock);
  }

  isChainValid() {
    for (let i = 1; i < this.chain.length; i++) {
      const curr = this.chain[i];
      const prev = this.chain[i - 1];

      if (curr.hash !== curr.computeHash()) return false;
      if (curr.previousHash !== prev.hash) return false;
    }
    return true;
  }
}

// === Simulation Example ===
const myBlockchain = new Blockchain();

const tx1 = new Transaction('Alice', 'Bob', 100);
const tx2 = new Transaction('Bob', 'Charlie', 40);

myBlockchain.addBlock([tx1]);
myBlockchain.addBlock([tx2]);

myBlockchain.chain.forEach((block) => {
  console.log(`\nBlock ${block.index}`);
  console.log(`Timestamp: ${block.timestamp}`);
  console.log(`Transactions: ${block.transactions.map(t => t.toString()).join('; ')}`);
  console.log(`Nonce: ${block.nonce}`);
  console.log(`Hash: ${block.hash}`);
  console.log(`Previous Hash: ${block.previousHash}`);
});
