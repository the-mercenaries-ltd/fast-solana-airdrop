const fs = require('fs');

const tokenSnapshot = require("./data/token-snapshot.json");

const whitelistAccounts = require("./data/whitelist-accounts.json");

const mergedList = [];

for ( let i = 0; i < whitelistAccounts.length; i++ ) {
  let whitelistAccount = whitelistAccounts[i];
  const found = tokenSnapshot.find(account => account.owner == whitelistAccount.owner);
  let account = { ...whitelistAccount };
  console.log({
    found,
    _found: found ? true : false
  })
  account.balance = found ? found.balance : 0;
  console.log({account})
  account.pending = account.targetBalance - account.balance;
  mergedList.push(account);
}

const pendingAirdropList = mergedList.filter(account => account.pending > 0);

let pendingCount = 0;

for ( const account of pendingAirdropList )
  pendingCount += account.pending;

console.log(`pendingAirdropList.length: ${pendingAirdropList.length}`);
console.log(`pendingCount: ${pendingCount}`);

const outputFilepath = './data/pending-airdrop-accounts.json';

fs.unlinkSync(outputFilepath);

let jsonString = JSON.stringify(pendingAirdropList, null, 2);

fs.writeFile(outputFilepath, jsonString, (err) => {
  if (err) throw err;
  console.log('Data written to file');
});