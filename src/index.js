import express from 'express';
import bodyParser from 'body-parser';
import { Blockchain, Wallet, Miner } from './Models';
import P2PService, { MESSAGE } from './p2p';

const { HTTP_PORT = 3000 } = process.env;

const app = express();
const blockchain = new Blockchain();
const wallet = new Wallet(blockchain);
const walletMiner = new Wallet(blockchain, 0);
const p2pService = new P2PService(blockchain);
const miner = new Miner(blockchain, p2pService, walletMiner);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/blocks', (req, res) => {
	res.json(blockchain.blocks);
})

app.get('/transactions',(req,res)=>{
	const { memoryPool: { transactions } } = blockchain;
	res.json(transactions);
})

app.post('/transaction',(req,res)=>{
	const { body: { recipient, amount } } = req;
	console.log(req.body)
	const transaction = wallet.createTransaction(recipient, amount);
		p2pService.broadcast(MESSAGE.TX, transaction);
		res.json({
			transaction,
			message: 'Transaction created successfully'
		});
	
})

app.get('/mine/transactions',(req,res)=>{
	try{
		miner.mine();
		res.redirect('/blocks');
	}
	catch (err) {
		res.status(400).json({
			error: err.message
		});
	}
})

app.post('/wallet',(req,res)=>{
	const { publicKey } = new Wallet();
	res.json({ publicKey });
})


app.listen(HTTP_PORT, () => {
	console.log(`Service BC PORT: ${HTTP_PORT}`);
	p2pService.listen();
})
