import { Block, MemoryPool } from '.';
import { validate } from '../modules';

class Blockchain {
	constructor() {
	  this.blocks = [Block.genesis];
	}
  
	addBlock(data) {
	  const previousBlock = this.blocks[this.blocks.length - 1];
	  const block = Block.mine(previousBlock, data);
  
	  this.blocks.push(block);
  
	  return block;
	}
  
	replace(newBlocks = []) {
	  if (newBlocks.length < this.blocks.length) throw new Error('Received chain is not longer than current chain.');
	  try {
		validate(newBlocks);
	  } catch (error) {
		throw new Error('Received chain is invalid');
	  }
  
	  this.blocks = newBlocks;
  
	  return this.blocks;
	}
  }
  
  export default Blockchain;
  