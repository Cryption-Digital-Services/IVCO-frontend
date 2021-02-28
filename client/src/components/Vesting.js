import React, { useEffect, useState } from "react";
import { Timer } from "./Timer";
import "./Vesting.scss";
import { useParams } from "react-router-dom";
import { useQuery, gql } from "@apollo/client";
import { ethers, Contract } from "ethers";
import tokenabi from "../contracts/token.json";
import crowdsaleabi from "../contracts/Crowdsale.json";
import swal from "sweetalert";

const getEachToken = gql`
  query Token($idParams: ID!) {
    crowdsale(id: $idParams) {
      crowdsaleStart
      crowdsaleEnd
      cliffDuration
      vestingStart
      vestingEnd
      owner
      hardcap
      rate
      token {
        id
        address
        name
        symbol
        decimals
      }
    }
  }
`;

const unixTimeConverter = (unixDate) => {
  return new Date(unixDate * 1000).toLocaleDateString("en-US");
};

export const Vesting = ({ SIGNER, data1, account, decimal }) => {
  useEffect(() => {
    //esl
  }, []);

  const { id } = useParams();
  console.log(data1);
  const { loading, error, data } = useQuery(getEachToken, {
    variables: { idParams: id },
  });
  // window.alert("vesting");
  const unixTimeConverter = (unixDate) => {
    return new Date(unixDate * 1000).toLocaleDateString("en-US");
  };

  let usdtaddress = "0x9093F303C897717edaD0445C26BD0B33Fe45fD11";
  let daiaddress = "0x34737f90FD62BC9B897760Cd16F3dFa4418096E1";
  let usdcaddress = "0xC1e7958EA57c742fe8f3278388a94B53998DDBe5";
  let crowdsaleaddress = data1.id;
  const [coinselected, setcoinselected] = useState(daiaddress);
  const onchangecoin = (e) => {
    setcoinselected(e.target.value);
    // window.alert(e.target.value);
  };

  const [inputvalue, setinputvalue] = useState(1);
  const onchangeinput = (e) => {
    setinputvalue(e.target.value);
  };

  const [vestingdata, setvestingdata] = useState({
    claimable: 0,
    claimed: 0,
    totalpurchased: 0,
  });

  const loadBlockchainData = async () => {
    const crowdsalecontract = new Contract(
      crowdsaleaddress,
      crowdsaleabi.abi,
      SIGNER
    );

    let claimable;
    await crowdsalecontract.remainingBalance(account).then((response) => {
      claimable = ethers.utils.formatUnits(
        response.toString(),
        data?.crowdsale?.token?.decimals
      );
    });
    let claimed;
    await crowdsalecontract.totalDrawn(account).then((response) => {
      claimed = ethers.utils.formatUnits(
        response.toString(),
        data?.crowdsale?.token?.decimals
      );
    });

    let totalpurchased;
    await crowdsalecontract.vestedAmount(account).then((response) => {
      totalpurchased = ethers.utils.formatUnits(
        response.toString(),
        data?.crowdsale?.token?.decimals
      );
    });

    console.log(claimed);
    console.log(claimable);
    console.log(totalpurchased);
    setvestingdata({ claimable, claimed, totalpurchased });
    // window.alert(data?.crowdsale?.token?.decimals);
  };

  const calimfunction = async () => {
    const crowdsalecontract = new Contract(
      crowdsaleaddress,
      crowdsaleabi.abi,
      SIGNER
    );
    if (vestingdata.claimable > 0) {
      try {
        const tx = await crowdsalecontract.drawDown();
        const trx = tx.wait();
      } catch (e) {
        console.log(e);
        swal("error in doing trandaction");
      }
    } else {
      swal("you claimable balance is  0");
    }

    // setloading(false);
  };
  const [abc, setabc] = useState(true);
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#1a1b23",
        }}
      >
        <h1 style={{ color: "white" }}>Loading...</h1>
      </div>
    );
  } else if (error) {
    console.log(error);
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#1a1b23",
        }}
      >
        <h1>Error</h1>
      </div>
    );
  } else {
    if (abc == true) {
      loadBlockchainData();
      setabc(false);
    }

    return (
      // <div className="card-page">
      //   <div className="header-container">
      //     <div className="main-heading">
      //       <div>{data?.crowdsale?.token?.symbol}</div>
      //       <div>{data?.crowdsale?.token?.name}</div>
      //     </div>
      //   </div>
      //   <div className="card-page-display-box">
      //     <div className="sub-container sub-container-1">
      //       <div className="displayBtn">
      //         Token Address: {`  `}
      //         <a
      //           href={` https://explorer-mumbai.maticvigil.com/address/${data?.crowdsale?.token?.address}/transactions`}
      //           target="_blank"
      //         >
      //           {data?.crowdsale?.token?.address}
      //         </a>{" "}
      //       </div>
      //       <div className="displayBtn">
      //         Admin Add: {`  `}
      //         {/* <a
      //           href={`https://kovan.etherscan.io/address/${data?.crowdsale?.token?.address}`}
      //         > */}
      //         {data?.crowdsale?.owner}
      //         {/* </a>{' '} */}
      //       </div>
      //       <div className="displayBtn">
      //         Name: {`  `}
      //         {data?.crowdsale?.token?.name}
      //       </div>
      //       <div className="displayBtn">
      //         Symbol: {`  `}
      //         {data?.crowdsale?.token?.symbol}
      //       </div>
      //       <div className="displayBtn">
      //         Decimals: {`  `}
      //         {data?.crowdsale?.token?.decimals}
      //       </div>
      //     </div>
      //     <div className="sub-container sub-container-1">
      //       <div className="sub-container-heading">IVCO Details</div>
      //       <div className="inner-displayBtn">
      //         Start Date: {`  `}
      //         <span className="displayBtn">
      //           {unixTimeConverter(data?.crowdsale?.crowdsaleStart)}
      //         </span>
      //       </div>
      //       <div className="inner-displayBtn">
      //         End Date: {`  `}
      //         <span className="displayBtn">
      //           {" "}
      //           {data?.crowdsale?.crowdsaleEnd}
      //         </span>
      //       </div>

      //       <div className="inner-displayBtn">
      //         Rate: <span className="displayBtn">{data?.crowdsale?.rate}</span>
      //       </div>
      //       <div style={{ margin: "5px" }}>
      //         $1 = 1000 {` `}
      //         {data?.crowdsale?.token?.symbol}
      //       </div>
      //       <div className="inner-displayBtn">
      //         Hard Cap:{" "}
      //         <span className="displayBtn">
      //           {" "}
      //           {parseFloat(
      //             ethers.utils.formatUnits(
      //               data?.crowdsale?.hardcap.toString(),
      //               data?.crowdsale?.token?.decimals
      //             )
      //           )}
      //         </span>
      //       </div>

      //       <div style={{ margin: "5px" }}>
      //         10,000 {` `}
      //         {data?.crowdsale?.token?.symbol} = ${" "}
      //         {parseFloat(
      //           ethers.utils.formatUnits(
      //             data?.crowdsale?.hardcap.toString(),
      //             data?.crowdsale?.token?.decimals
      //           )
      //         ) * parseFloat(data?.crowdsale?.rate)}{" "}
      //         {` `}
      //       </div>
      //     </div>
      //     <div className="sub-container sub-container-1">
      //       <div className="sub-container-heading">Vesting Details</div>
      //       <div className="inner-displayBtn">
      //         Cliff Period: {`  `}
      //         <span className="displayBtn">
      //           {data?.crowdsale?.cliffDuration}
      //         </span>
      //       </div>

      //       <div className="inner-displayBtn">
      //         Start Date: {`  `}
      //         <span className="displayBtn">
      //           {data?.crowdsale?.vestingStart}
      //         </span>
      //       </div>
      //       <div className="inner-displayBtn">
      //         End Date: {`  `}
      //         <span className="displayBtn">{data?.crowdsale?.vestingEnd}</span>
      //       </div>
      //     </div>
      //   </div>
      //   <div className="input-box-container">
      //     <input
      //       type="number"
      //       name="amount"
      //       id="amount"
      //       className="input-box amount"
      //       placeholder="Amount"
      //     />
      //     <select
      //       name="currencies"
      //       id="demo-currencies"
      //       className="demo-select-css"
      //     >
      //       <option className="demo-dropdownValues" value="Bitcoin">
      //         Bitcoin
      //       </option>
      //       <option className="demo-dropdownValues" value="Ethereum">
      //         Ethereum
      //       </option>
      //       <option className="demo-dropdownValues" value="Dogecoin">
      //         Dogecoin
      //       </option>
      //       <option className="demo-dropdownValues" value="Litecoin">
      //         Litecoin
      //       </option>
      //     </select>
      //   </div>
      //   <div className="btn-container">
      //     <button className="btn invest-into-tkn">Invest into TKN</button>
      //   </div>
      // </div>
      <div className="card-page">
        <div className="header-container">
          <div className="main-heading">Vesting</div>
        </div>
        <div className="card-page-display-box">
          <div className="sub-container sub-container-1">
            <div className="displayBtn">
              <a
                href={` https://explorer-mumbai.maticvigil.com/address/${data?.crowdsale?.token?.address}/transactions`}
                target="_blank"
              >
                {data?.crowdsale?.token?.address}
              </a>{" "}
            </div>
            <div className="displayBtn">
              Symbol: {data?.crowdsale?.token?.symbol}
            </div>
            <div className="displayBtn">
              Rate: 1 DAI = {data?.crowdsale?.rate}{" "}
              {data?.crowdsale?.token?.symbol}
            </div>
          </div>
          <div className="sub-container sub-container-1">
            <div className="displayBtn">
              Vesting start:{" "}
              {data?.crowdsale?.vestingStart == 0
                ? "End Manually "
                : unixTimeConverter(data?.crowdsale?.vestingStart)}
            </div>
            <div className="displayBtn">
              Vesting End:{" "}
              {data?.crowdsale?.vestingStart == 0
                ? "End Manually "
                : unixTimeConverter(data?.crowdsale?.vestingEnd)}
            </div>
            <div className="displayBtn">
              Cliff Period:{" "}
              {parseFloat(data?.crowdsale?.vestingStart) +
                parseFloat(data?.crowdsale?.cliffDuration) ==
              0
                ? "End Manually "
                : parseFloat(data?.crowdsale?.vestingStart) +
                  parseFloat(data?.crowdsale?.cliffDuration)}
            </div>
          </div>
          <div className="sub-container sub-container-1">
            <div className="count-down">
              Claimed: {vestingdata.claimed} {data?.crowdsale?.token?.symbol}
            </div>
            <div className="total-presale-amount">
              Claimable:{vestingdata.claimable}{" "}
              {/* {parseFloat(
                ethers.utils.formatUnits(
                  data?.crowdsale?.hardcap.toString(),
                  data?.crowdsale?.token?.decimals
                )
              )}{" "} */}
              {data?.crowdsale?.token?.symbol}
            </div>
            <div className="filled-amount">
              Total Purchased: {vestingdata.totalpurchased}{" "}
              {/* {parseFloat(
                ethers.utils.formatUnits(
                  data?.crowdsale?.hardcap.toString(),
                  data?.crowdsale?.token?.decimals
                )
              )}{" "} */}
              {data?.crowdsale?.token?.symbol}
            </div>
          </div>
        </div>
        {/* <div className="input-box-container">
          <input
            type="number"
            name="amount"
            id="amount"
            className="input-box amount"
            placeholder="Amount"
            value={inputvalue}
            onChange={onchangeinput}
          />

          <select
            name="currencies"
            id="currencies"
            className="select-css"
            onChange={onchangecoin}
          >
            <option
              className="dropdownValues"
              value={daiaddress}
              backgroundColor="#000000"
              default
            >
              dai
            </option>
            <option
              className="dropdownValues"
              value={usdtaddress}
              backgroundColor="#000000"
            >
              usdt
            </option>
            <option
              className="dropdownValues"
              value={usdcaddress}
              backgroundColor="#000000"
            >
              usdc
            </option>
          </select>
        </div> */}
        <div className="btn-container">
          <button className="btn invest-into-tkn" onClick={calimfunction}>
            Claim
          </button>
        </div>
      </div>
    );
  }
};
