import { useEffect, useState } from 'react';
import './App.css';

import { ethers } from 'ethers';
import myEpicNFT from './utils/MyEpicNFT.json';

function App() {

  const [currentAccount, setCurrentAccount] = useState("");

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
    }
    else {
      console.log("We have ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: 'eth_accounts' });

    if (accounts.length !== 0) {
      console.log("Found an authorized account : ", accounts[0]);
    }
    else {
      console.log("No authorized account found");
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get Metamask!");
        return;
      }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });

      console.log("Connected account : ", accounts[0]);
      setCurrentAccount(accounts[0]);
    }
    catch (err) {
      console.log(err);
    }
  }

  const askContractToMintNFTs = async () => {
    const CONTRACT_ADDRESS = "0x5bf484F93176B864e904F57a8F673a23E2d35028";

    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNFT.abi, signer);

        console.log("Going to pop wallet to pay gas...");
        let txn = await connectedContract.makeAnEpicNFT();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${txn.hash}`);

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber());
          alert(`Hey, there! We've minted your NFT. It may be blank right now. It can take max of 10 minutes Opensea. Here's the link: <https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}>`);
        });
      }
      else {
        console.log("Ethereum object doesn't exist");
      }
    }
    catch (err) {
      console.log(err);
    }
  }

  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">My NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          {currentAccount === "" ? renderNotConnectedContainer() : <button type='button' onClick={askContractToMintNFTs} className="cta-button connect-wallet-button">Mint NFT</button>}
        </div>
      </div>
    </div>
  );
}

export default App;
