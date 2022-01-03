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
        // console.log("encryted toString",encryted.toString());
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
    
    isChainValid(){
         for(let i=1; i < this.chain.length; i++) {
             const currentBlock = this.chain[i];
             const previousBlock = this.chain[i-1];
            if(currentBlock.hash !== currentBlock.calculateHash()) return false;
            if(currentBlock.perviousHash !== previousBlock.hash) return false;
        }
        return true;
    }
}

let techMonkeyCoin = new Blockchain();
techMonkeyCoin.addBlock(new Block(1,"03/01/2022",{amt:"techMonkey======> 1"}));
techMonkeyCoin.addBlock(new Block(2,"02/01/2022",{amt:"techMonkey======> 2"}));

console.log("techMonkeyCoin", JSON.stringify(techMonkeyCoin,null,4));
console.log("Is block chain valid ??", techMonkeyCoin.isChainValid());
console.log("temper again..!!");
techMonkeyCoin.chain[1].data = {amt:"techMonkey======> 0"};
console.log(techMonkeyCoin.chain[1]);
console.log("check again..........Is block chain valid ??", techMonkeyCoin.isChainValid());

