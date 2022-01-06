import Blockchain from "../../../src/Models/Blockchain";
import validate from '../../../src/modules/validate';

describe('validate()',()=>{
	let blockchain;

	beforeEach(()=>{
		blockchain = new Blockchain();
	})

	it('validate a valid chain', ()=>{
		//Validamos una cadena valida
		blockchain.addBlock('Test-d4t4');
		blockchain.addBlock('Test-d4t42');

		expect(validate(blockchain.blocks)).toBe(true);
	})

	it('invalidates a chain with a corrupt genesis block', ()=>{
		//Mutamos el bloque genesis para ver si se invalida la cadena
		blockchain.blocks[0].data = 'Corrupt-Data';
		
		expect(()=>{
			validate(blockchain.blocks);
		}).toThrowError('Invalid Genesis Block');
	})

	it('invalidates a chain with a corrupt previousHash within a block', ()=>{
		//Mutamos el hash del bloque anterior para ver si se invalida la cadena
		blockchain.addBlock('Test-d4t4');
		blockchain.blocks[1].previousHash = 'Corrupt-Data';

		expect(()=>{
			validate(blockchain.blocks);
		}).toThrowError('Invalid Hashes');
	})

	it('invalidates a chain with a corrupt hash within a block', ()=>{
		//Mutamos el hash del bloque para ver si se invalida la cadena
		blockchain.addBlock('Test-d4t4');
		blockchain.blocks[1].hash = 'Corrupt-Data';

		expect(()=>{
			validate(blockchain.blocks);
		}).toThrowError('Invalid Hashes');
	})
})