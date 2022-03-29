const tokenMint = "4WhVLC1ysJcask71ao1genPqVkn6tA89qrT6Xbjhbhjy";

const pendingAirdropAccounts = require("./data/pending-airdrop-accounts.json");

var fs = require('fs')

const outputFilepath = './out/airdrop-script.sh';

fs.unlinkSync(outputFilepath);

var logger = fs.createWriteStream(outputFilepath, {
  flags: 'w'
})

for ( let i = 0; i < pendingAirdropAccounts.length; i++) {
  const account = pendingAirdropAccounts[i];
  logger.write(`spl-token transfer ${tokenMint} 1 ${account.owner} --fund-recipient --allow-unfunded-recipient &` + "\r\n") // append string to your file
  if ( (i + 1) % 10 == 0 )
    logger.write(`sleep 10` + "\r\n");
}

console.log(`Data written to file: ${outputFilepath}`);