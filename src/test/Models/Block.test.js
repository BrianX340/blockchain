import Block, { DIFFICULTY } from "../../../src/Models/Block";


describe('Block', () => {
	let timestamp;
	let previousBlock;
	let data;
	let hash;
	let nonce;
	let difficulty;
  
	beforeEach(() => {
	  timestamp = new Date(2010, 0, 1);
	  previousBlock = Block.genesis;
	  data = 't3St-d4t4';
	  hash = 'h4S4';
	  nonce = 128;
	  difficulty = DIFFICULTY;
	});
  
	it('create an instance with parameters', () => {
	  const block = new Block(timestamp, previousBlock.hash, hash, data, nonce);
  
	  expect(block.timestamp).toEqual(timestamp);
	  expect(block.previousHash).toEqual(previousBlock.hash);
	  expect(block.data).toEqual(data);
	  expect(block.hash).toEqual(hash);
	  expect(block.nonce).toEqual(nonce);
	});
  
	it('use static mine()', () => {
	  const block = Block.mine(previousBlock, data);
	  const { difficulty } = block;
  
	  expect(block.hash.length).toEqual(64);
	  expect(block.hash.substring(0, difficulty)).toEqual('0'.repeat(difficulty));
	  expect(block.previousHash).toEqual(previousBlock.hash);
	  expect(data).toEqual(data);
	  expect(block.nonce).toBeGreaterThan(0);
	});
  
	it('Usando el hasheador', () => {
	  hash = Block.hash(timestamp, previousBlock.hash, data, nonce, difficulty);
	  expect(hash).toEqual(Block.hash(timestamp, previousBlock.hash, data, nonce, difficulty));
	});
  
	it('use toString()', () => {
	  const block = Block.mine(previousBlock, data);
  
	  expect(typeof block.toString()).toEqual('string');
	});
  });
  