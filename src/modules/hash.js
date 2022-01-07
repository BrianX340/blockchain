import { SHA256 } from "crypto-js";

export default (data)=>{
	return SHA256(JSON.stringify(data)).toString();
}