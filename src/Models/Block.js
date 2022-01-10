import { adjustDifficulty, hashGenerator } from '../modules';

const DIFFICULTY = 3;

class Block {
	constructor(timestamp, previousHash, hash, data, nonce, difficulty) {
	  this.timestamp = timestamp;
	  this.previousHash = previousHash;
	  this.hash = hash;
	  this.data = data;
	  this.nonce = nonce;
	  this.difficulty = difficulty;
	}
  
	static get genesis() {
	  const timestamp = (new Date(2000, 0, 1)).getTime();
	  return new this(timestamp, undefined, 'X340-63n3515', 'Holanda Mundana!', 0, DIFFICULTY);
	}
  
	static mine(previousBlock, data) {
	  const { hash: previousHash } = previousBlock;
	  let timestamp;
	  let hash;
	  let nonce = 0;
	  let {difficulty} = previousBlock;

	  do {
		  timestamp = Date.now();
		  nonce++;
		  difficulty = adjustDifficulty(previousBlock, timestamp);
		  hash = Block.hash(timestamp, previousHash, data, nonce, difficulty);

	  } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

	  return new this(timestamp, previousHash, hash, data, nonce, difficulty);
	}
  
	static hash(timestamp, previousHash, data, nonce, difficulty) {
	  return hashGenerator(`${timestamp}${previousHash}${data}${nonce}${difficulty}`);
	}
  
	toString() {
	  const {
		timestamp, previousHash, hash, data, nonce, difficulty
	  } = this;
  
	  return `Block -
		timestamp       : ${timestamp}
		previousHash    : ${previousHash}
		hash            : ${hash}
		data            : ${data}
		nonce           : ${nonce}
		difficulty      : ${difficulty}
	  `;
	}
  }

  export { DIFFICULTY };
  
  export default Block;
  