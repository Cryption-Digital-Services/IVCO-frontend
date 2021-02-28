import { ethers, Contract } from "ethers";
import React, { useEffect, useState } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import Web3 from "web3";
import Navbar from "./Navbar";
import swal from "sweetalert";
import { IVCO } from "./IVCO";
import "./App.scss";
import tokenabi from "./contracts/token.json";
import IVCOFactory from "./contracts/LaunchpadFactory.json";

const App = () => {
  const [refresh, setrefresh] = useState(0);
  const [getNetwork, setNetwork] = useState("");

  let content;
  const [loading2, setloading2] = useState(false);

  const [account, setAccount] = useState("");
  const [loading, setLoading] = useState(true);
  const [IVCOFactoryContract, setIVCOFactoryContract] = useState({});
  const [SIGNER, SETSIGNER] = useState({});
  const [flag, setflag] = useState(0);
  // const provider = await detectEthereumProvider();
  const loadWeb3 = async () => {
    if (window.ethereum) {
      await window.ethereum.enable();
    } else {
      window.alert(
        "Non-Ethereum browser detected. You should consider trying MetaMask!"
      );
    }
  };

  const loadBlockchainData = async () => {
    setLoading(true);
    if (typeof window.ethereum == "undefined") {
      return;
    }

    const ethereum = window.ethereum;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    SETSIGNER(signer);

    let url = window.location.href;
    console.log(url);

    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    console.log(accounts);
    if (accounts.length == 0) {
      return;
    }

    setAccount(accounts[0]);

    var networkId;
    await provider.getNetwork().then((result) => {
      networkId = result.chainId;
    });
    if (networkId === 80001) {
      // set network name here
      setNetwork("MATIC Testnet");
      // defining a smart contract ;
      // signer is defined above no need to define again
      const smartcontract = new Contract(
        "0x223D34ed1048A9a267F195A2a79433Fa99101414",
        IVCOFactory.abi,
        signer
      );
      // let smartcontract;
      setIVCOFactoryContract(smartcontract);

      // if you want to call data from smart contract follow below
      // suppose there is function in smart contract which returns something

      // await smartcontract
      //   .functioninsmartcontract(accounts[0].toString())
      //   .then((result) => {
      //     console.log("vesting schedule data ", result);
      //   });

      // suppose there is a call function only or a public variable
      // await smartcontract.functioninsmartcontract();

      setLoading(false);
    } else {
      window.alert("the contract not deployed to detected network.");
      setloading2(true);
    }
  };

  const gettokeninfo = async (address) => {
    try {
      const erc20contract = new Contract(address, tokenabi.abi, SIGNER);
      const name = await erc20contract.name();
      const symbol = await erc20contract.symbol();
      const decimal = await erc20contract.decimals();

      return {
        name,
        symbol,
        decimal,
      };
    } catch (e) {
      return 0;
    }
  };

  const createLaunchpad = async (
    _tokenAddress,
    _amountAllocation,
    _owner,
    _rate,
    _crowdsaleStartTime,
    _crowdsaleEndTime,
    _vestingStartTime,
    _vestingEndTime,
    _cliffDurationInSecs
  ) => {
    // setloading(true);
    // window.alert(_amountAllocation);
    console.log({
      _tokenAddress,
      _amountAllocation,
      _owner,
      _rate,
      _crowdsaleStartTime,
      _crowdsaleEndTime,
      _vestingStartTime,
      _vestingEndTime,
      _cliffDurationInSecs,
    });
    const amount = 1000000;

    const erc20contract = new Contract(_tokenAddress, tokenabi.abi, SIGNER);
    const decimals = await erc20contract.decimals();

    var x = ethers.utils.parseUnits(amount.toString(), decimals);
    // window.alert(x);
    const allowance = await erc20contract.allowance(
      account,
      "0x223D34ed1048A9a267F195A2a79433Fa99101414"
    );
    _amountAllocation = ethers.utils.parseUnits(
      _amountAllocation.toString(),
      decimals
    );
    _rate = ethers.utils.parseEther(_rate.toString());
    // window.alert(allowance);
    if (allowance < 1000) {
      try {
        const tx = await erc20contract.approve(
          "0x223D34ed1048A9a267F195A2a79433Fa99101414",
          x
        );
        console.log(tx);
        const txsign = await tx.wait();
      } catch (e) {
        console.log(e);
        swal("transaction failed");
        // window.location.reload();
      }
    }

    try {
      var x = ethers.utils.parseEther(_rate.toString());
      const tx = await IVCOFactoryContract.launchCrowdsale(
        _tokenAddress,
        _amountAllocation,
        _owner,
        _rate,
        _crowdsaleStartTime,
        _crowdsaleEndTime,
        _vestingStartTime,
        _vestingEndTime,
        _cliffDurationInSecs
      );
      console.log(tx);
      const txsign = await tx.wait();

      window.location.reload();
    } catch (e) {
      console.log(e);
      swal("transaction failed");
    }
    // setloading(false);
  };

  const walletAddress = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log(accounts);
    if (accounts.length == 0) {
      return;
    }
    setAccount(accounts[0]);
    loadBlockchainData();
  };

  useEffect(() => {
    loadWeb3();
    loadBlockchainData();

    if (refresh == 1) {
      setrefresh(0);
      loadBlockchainData();
    }
    //esl
  }, [refresh]);

  if (loading === true) {
    content = (
      <p className="loading-page">
        Loading...{loading2 ? <div>loading....</div> : ""}
      </p>
    );
  } else {
    content = (
      <>
        <IVCO
          createLaunchpad={createLaunchpad}
          account={account}
          gettokeninfo={gettokeninfo}
          SIGNER={SIGNER}
        />
      </>
    );
  }

  return (
    <div>
      <Navbar account={account} getNetwork={getNetwork} />

      {account == "" ? (
        <div className="metamask-loading-container">
          Connect your wallet to application
          <button onClick={walletAddress} className="metamask-btn">
            Metamask
          </button>
        </div>
      ) : (
        content
      )}
    </div>
  );
};

export default App;
