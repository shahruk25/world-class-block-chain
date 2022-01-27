const SHA256 = require('crypto-js/sha256');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
class Block {

    constructor(timestamp, txn, perviousHash='', nonce = 0){
        // console.log("............Block................");
        this.timestamp = timestamp;
        this.txn = txn;
        this.perviousHash = perviousHash;
        this.hash = this.calculateHash();
        this.nonce = nonce;
    }

    calculateHash(){
        // let encryted = SHA256(this.index + this.timestamp + this.perviousHash + JSON.stringify(this.txn));
        // console.log("encryted",encryted);
        // console.log("encryted toString",encryted.toString());
        return SHA256(this.perviousHash + this.timestamp  + JSON.stringify(this.txn) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0,difficulty) !== Array(difficulty+1).join("0")){
            console.log("nonce = ",this.nonce);
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Blocked mined:",this.hash);
    }

}
class Blockchain{
    constructor(){
        // console.log("............BlockChain................");
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 2;
        this.pendingTransaction = [];
        this.miningRewards = 100;
    }

    createGenesisBlock(){
        return new Block(new Date(), "techMonkey", "0");
    }

    getLatestBlock(){
        return this.chain[this.chain.length-1];
    }

    miningPendingTxn(miningRewardAddress){
        let block =  new Block(Date.now,this.pendingTransaction);
        block.mineBlock(this.difficulty);

        console.log("Block successfully mined!");
        this.chain.push(block);
        this.pendingTransaction = [
            new Transaction(null, miningRewardAddress,this.miningRewards)
        ];
    }

    createTransaction(txn){
        this.pendingTransaction.push(txn);
    }

    getBalance(address){
        let balance = 0;
        for(const block of this.chain){
             for(const txn of block.txn){
                if(txn.fromAddress === address ) balance -=txn.amount;
                if(txn.toAddress === address ) balance +=txn.amount;
             }   
        }
        return balance;

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
techMonkeyCoin.createTransaction(new Transaction("address1","address2",1000));
techMonkeyCoin.createTransaction(new Transaction("address1","address2",500));

console.log("\n Start mining ..");
techMonkeyCoin.miningPendingTxn("techMonkey#Address");

console.log("techMonkey balance = ",techMonkeyCoin.getBalance("techMonkey#Address"));

console.log("\n Start mining again..");
techMonkeyCoin.miningPendingTxn("techMonkey#Address");

console.log("techMonkey balance = ",techMonkeyCoin.getBalance("techMonkey#Address"));
