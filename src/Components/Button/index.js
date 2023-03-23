import React, { useState, useEffect } from 'react';
import './Button.css';
import { ethers } from 'ethers';
// import ERC20 from "../../Contracts/erc20.json"
import faucet from "../../Contracts/faucet.json"

// Debe estar apuntando a polygon testnet
const usdMockAddress = "0xD6920eeAF9b9bc7288765F72B4d6Da3e47308464";
const faucetAddress = "0x20964124c3f870BD95c842836d75E91F5BAFdF7b";
const faucetABI = faucet;

function Button() {
  let signer = '';
  let faucetContract;
  const [isConnected, setIsConnected] = useState(false);
  
  const initContract = async () => {
    faucetContract = new ethers.Contract(faucetAddress, faucetABI, signer);
  }

  useEffect(() => {
    connectWallet();
  }, []);

  
  const connectWallet = async () => {
    console.log('hola')
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        console.log('Conectado a MetaMask');
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = await provider.getSigner();
        await initContract();
        setIsConnected(true); // Actualiza el estado

      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('MetaMask no está instalado');
    }
  };

  const claim = async () => {
    if (isConnected) {
      //Porque tengo que tengo que tirar estas 3 lineas si ya se hace durante el conectWallet... 
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = await provider.getSigner();
      await initContract(); 

      try {
        const tx = await faucetContract.claim(usdMockAddress, {
        gasLimit: 300000,
      });
        console.log(tx);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('Necesitas conectarte a MetaMask primero');
    }
  };

  return (
    <div className="App">
      <div className='container'>
        <p></p>
        <button className='myboton' onClick={isConnected ? claim : connectWallet }>
          <p className='buttontext'>{isConnected ? 'Claim tokens': 'Connect to wallet'}</p> 
        </button>     
      </div>
    </div>
  );
}

export default Button;

