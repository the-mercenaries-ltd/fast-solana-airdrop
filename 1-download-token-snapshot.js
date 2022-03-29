const axios = require('axios');
const fs = require('fs');

// const rpcUrl = "http://api.mainnet-beta.solana.com";
const rpcUrl = "https://api.devnet.solana.com";

async function main() {

  const tokenMint = "79krru6tvDsTbEQFwjbYQervsmJsSup4GPJ1L2isF75S";
  
  var data = JSON.stringify({
    "jsonrpc": "2.0",
    "id": 1,
    "method": "getProgramAccounts",
    "params": [
      "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
      {
        "encoding": "jsonParsed",
        "filters": [
          {
            "dataSize": 165
          },
          {
            "memcmp": {
              "offset": 0,
              "bytes": tokenMint
            }
          }
        ]
      }
    ]
  });
  
  var config = {
    method: 'post',
    url: rpcUrl,
    headers: { 
      'Content-Type': 'application/json'
    },
    data : data
  };
  
  const response = await axios(config);

  const tokenSnapshot = [];

  for ( const singleResult of response.data.result ) {
    const { account } = singleResult;
    const { info }  = account.data.parsed;
    const balance = info.tokenAmount.uiAmount;
    const foundIndex = tokenSnapshot.findIndex(account => account.owner == info.owner);
    if ( foundIndex > -1 ) {
      tokenSnapshot[ foundIndex ].balance += balance;
    } else {
      const newAccount = {
        owner: info.owner,
        balance,
      };
      tokenSnapshot.push(newAccount);
    }
  }

  let totalCount = 0;

  for ( const account of tokenSnapshot )
    totalCount += account.balance;

  console.log(`tokenMint: ${tokenMint}`);
  console.log(`totalCount: ${totalCount}`);

  const tokenSnapshotFilepath = './data/token-snapshot.json';

  fs.unlinkSync(tokenSnapshotFilepath);

  let jsonString = JSON.stringify(tokenSnapshot, null, 2);

  fs.writeFile(tokenSnapshotFilepath, jsonString, (err) => {
    if (err) throw err;
    console.log('Data written to file');
  });
}

main();
