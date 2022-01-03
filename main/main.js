const SHA256 = require('crypto-js/sha256');

class Block {

    constructor(index, timestamp, data, perviousHash=''){
        // console.log("............Block................");
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.perviousHash = perviousHash;
        this.hash = this.calculateHash();
    }

    calculateHash(){
        // let encryted = SHA256(this.index + this.timestamp + this.perviousHash + JSON.stringify(this.data));
        // console.log("encryted",encryted);
        // console.log("encryted toString",encryted.toString);
        return SHA256(this.index + this.perviousHash + this.timestamp  + JSON.stringify(this.data)).toString();
    }

}
class Blockchain{
    constructor(){
        // console.log("............BlockChain................");
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock(){
        return new Block(0,new Date(), "techMonkey", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    addBlock(newBlock){
        newBlock.perviousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
}

let techMonkeyCoin = new Blockchain();
techMonkeyCoin.addBlock(new Block(1,new Date,{amt:"techMonkey======> 1"}));
techMonkeyCoin.addBlock(new Block(2,new Date,{amt:"techMonkey======> 1"}));

console.log("techMonkeyCoin", JSON.stringify(techMonkeyCoin,null,4));
