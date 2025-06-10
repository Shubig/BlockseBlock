const crypto = require('crypto');

function computeHash(data, nonce) {
  const text = data + nonce;
  return crypto.createHash('sha256').update(text).digest('hex');
}

function mine(data, difficulty = 4) {
  const prefix = '0'.repeat(difficulty);
  let nonce = 0;
  let hash = computeHash(data, nonce);

  console.log(`Mining... difficulty: ${difficulty}`);

  while (!hash.startsWith(prefix)) {
    nonce++;
    hash = computeHash(data, nonce);
  }

  console.log(`✅ Mined successfully!`);
  console.log(`Nonce: ${nonce}`);
  console.log(`Hash: ${hash}`);
  return { nonce, hash };
}

// === Example Usage ===
const blockData = "Alice pays Bob 50 coins";
mine(blockData, 4); // Change difficulty if needed
