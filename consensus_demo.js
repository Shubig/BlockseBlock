const crypto = require('crypto');

// === BLOCK STRUCTURE ===
class Block {
  constructor(index, data, previousHash = '') {
    this.index = index;
    this.timestamp = new Date().toISOString();
    this.data = data;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  calculateHash() {
    const str = this.index + this.timestamp + this.data + this.previousHash + this.nonce;
    return crypto.createHash('sha256').update(str).digest('hex');
  }

  mineBlock(difficulty = 2) {
    const prefix = '0'.repeat(difficulty);
    while (!this.hash.startsWith(prefix)) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
  }
}

// === SIMULATED NODES ===
const nodes = [
  { name: 'Node A', stake: 50 },
  { name: 'Node B', stake: 150 },
  { name: 'Node C', stake: 100 }
];

// === PROOF OF WORK ===
function proofOfWorkConsensus(data, difficulty = 3) {
  const block = new Block(1, data, '0000');
  console.log('Mining with Proof of Work...');
  block.mineBlock(difficulty);
  console.log(`Mined Block Hash: ${block.hash}`);
  return block;
}

// === PROOF OF STAKE ===
function proofOfStakeConsensus(data) {
  console.log('Selecting validator with Proof of Stake...');
  const totalStake = nodes.reduce((sum, n) => sum + n.stake, 0);
  const rand = Math.random() * totalStake;

  let runningSum = 0;
  let selected;
  for (let node of nodes) {
    runningSum += node.stake;
    if (rand <= runningSum) {
      selected = node;
      break;
    }
  }

  console.log(`Validator selected: ${selected.name} (Stake: ${selected.stake})`);
  const block = new Block(1, data, '0000');
  block.hash = block.calculateHash(); // No mining needed
  return block;
}

// === SIMULATE BOTH ===
const powBlock = proofOfWorkConsensus('Transaction A -> B: 100');
console.log('\n---\n');
const posBlock = proofOfStakeConsensus('Transaction A -> B: 100');

console.log('\n[PoW Block Hash]', powBlock.hash);
console.log('[PoS Block Hash]', posBlock.hash);
