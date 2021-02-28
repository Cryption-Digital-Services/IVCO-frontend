import React, { useState } from "react";
import swal from "sweetalert";
import "./CreateIVCO.scss";
import { ethers, Contract } from "ethers";

export const CreateIVCO = ({ createLaunchpad, account, gettokeninfo }) => {
  const [enddatavalue, setenddatavalue] = useState("0");
  const [ischeckedendmanually, setischeckedendmanually] = useState(false);
  const [rateoftoken, setrateoftoken] = useState(1);
  const [hardcap, sethardcap] = useState(1000);
  const [ivcomodal, setivcomodal] = useState({
    tokenAdress: "",
    tokenName: "Cryption Network",
    tokenSymbol: "CNT",
    tokenDecimal: 18,
    startDate: 0,
    endDate: 0,
    endManully: false,
    tokenRate: 1,
    hardcap: 1000,
    cliffPeriod: 0,
    cliffStartDate: 0,
    cliffEndDate: 0,
    nocliffperiod: false,
  });

  const onchangecheckbox = () => {
    setivcomodal({
      ...ivcomodal,
      endManully: !ivcomodal.endManully,
      endDate: "End Manually",
    });
  };
  const handleChange = (e) => {
    setivcomodal({
      ...ivcomodal,
      [e.target.name]: e.target.value,
    });
  };

  const onsubmit = () => {
    // window.alert(tokenaddresstoken);
    if (ethers.utils.isAddress(tokenaddresstoken)) {
      // window.alert(ivcomodal.hardcap);
      if (ivcomodal.hardcap > 0) {
        if (true) {
          if (ivcomodal.tokenRate > 0) {
            if (ivcomodal.startDate > 0) {
              if (ivcomodal.endManully) {
                createLaunchpad(
                  tokenaddresstoken,
                  ivcomodal.hardcap,
                  account,
                  ivcomodal.tokenRate,
                  ivcomodal.startDate,
                  0,
                  0,
                  0,
                  0
                );
              } else {
                // window.alert(ivcomodal.cliffEndDate);
                // window.alert(ivcomodal.cliffStartDate);
                // window.alert(ivcomodal.cliffPeriod);
                if (
                  ivcomodal.cliffEndDate > 0 &&
                  ivcomodal.cliffPeriod > 0 &&
                  ivcomodal.cliffStartDate > 0
                ) {
                  createLaunchpad(
                    tokenaddresstoken,
                    ivcomodal.hardcap,
                    account,
                    ivcomodal.tokenRate,
                    ivcomodal.startDate,
                    ivcomodal.endDate,
                    ivcomodal.cliffStartDate,
                    ivcomodal.cliffEndDate,
                    ivcomodal.cliffPeriod
                  );
                } else {
                  swal("please input cliff values more than 0");
                }
              }
            } else {
              swal("please input start date more than 0");
            }
          } else {
            swal("please input rate more than 0");
          }
        } else {
          swal("invalid user account ");
        }
      } else {
        swal("please input hardcap more than 0");
      }
    } else {
      swal("token address invalid");
    }
  };
  const [tokenaddresstoken, settokenaddresstoken] = useState("");
  const onchangetokenaddress = async (e) => {
    // window.alert(e.target.value);
    const a = await gettokeninfo(e.target.value);
    // if (a == 0) {

    // }
    try {
      if (a.name.length > 0) {
        setivcomodal({
          ...ivcomodal,

          tokenName: a.name,
          tokenSymbol: a.symbol,
          tokenDecimal: a.decimal,
        });
      }
    } catch (e) {
      setivcomodal({
        ...ivcomodal,
        tokenName: "invalid address",
        tokenSymbol: "invalid address",
        tokenDecimal: "invalid address",
      });
    }

    console.log(a);
  };

  return (
    <div className="create-ivco-container">
      <div className="header-container">
        <div className="main-heading">New IVCO</div>
      </div>
      <div className="card-page-display-box">
        <div className="sub-container sub-container-1">
          <div className="token-address-container">
            <label htmlFor="token-address">Token Address</label>
            <input
              type="text"
              name="tokenAdress"
              id="token-address"
              className="input-box token-address"
              placeholder="Token address"
              value={tokenaddresstoken}
              onChange={(e) => {
                onchangetokenaddress(e);
                settokenaddresstoken(e.target.value);
                // window.alert(e.target.value);
              }}
            />
          </div>
          <div className="other-container">
            <label htmlFor="start-time">Token Name</label>
            <input
              type="text"
              name="tokenName"
              id="start-time"
              className="input-box start-time"
              placeholder="Cryption Network Token"
              value={ivcomodal.tokenName}
              disabled
            />
          </div>
          <div className="other-container">
            <label htmlFor="start-time">Token Symbol</label>
            <input
              type="text"
              name="tokenSymbol"
              id="start-time"
              className="input-box start-time"
              placeholder="CNT"
              value={ivcomodal.tokenSymbol}
              disabled
            />
          </div>

          <div className="other-container">
            <label htmlFor="start-time">Token Decimal</label>
            <input
              type="text"
              name="tokenDecimal"
              id="start-time"
              className="input-box start-time"
              placeholder="18"
              value={ivcomodal.tokenDecimal}
              disabled
            />
          </div>
        </div>
        <div className="sub-container sub-container-1">
          <div className="token-address-container">
            <label htmlFor="token-address">Start Date</label>
            <input
              type="text"
              name="startDate"
              id="token-address"
              className="input-box token-address"
              placeholder="Start date"
              onChange={handleChange}
            />
          </div>
          <div className="token-address-container">
            <label htmlFor="token-address">End Date</label>
            <input
              type="text"
              name="endDate"
              id="token-address"
              className="input-box token-address"
              placeholder="End date"
              onChange={handleChange}
              disabled={ivcomodal.endManully}
              value={ivcomodal.endDate}
            />
            <div className="checkbox-container">
              <label htmlFor="no-cliff-period">
                <input
                  type="checkbox"
                  name="endManullyy"
                  id="no-cliff-period"
                  className="no-cliff-period"
                  style={{ margin: "5px" }}
                  onChange={onchangecheckbox}
                />
                End Manually
              </label>
            </div>
          </div>
          <div className="token-address-container">
            <label htmlFor="token-address">Rate</label>
            <input
              type="text"
              name="tokenRate"
              id="token-address"
              className="input-box token-address"
              placeholder="Rate"
              value={ivcomodal.tokenRate}
              onChange={handleChange}
            />
            <div className="checkbox-container">
              <label>
                1 $ = {ivcomodal.tokenRate} {ivcomodal.tokenName}
              </label>
            </div>
          </div>
          <div className="token-address-container">
            <label htmlFor="token-address">Hardcap</label>
            <input
              type="text"
              name="hardcap"
              id="token-address"
              className="input-box token-address"
              placeholder="Hardcap"
              value={ivcomodal.hardcap}
              onChange={handleChange}
            />
            <div className="checkbox-container">
              <label>
                {ivcomodal.hardcap} {ivcomodal.tokenName} = ${" "}
                {ivcomodal.tokenRate * ivcomodal.hardcap}
              </label>
            </div>
          </div>
        </div>
        {ivcomodal.endManully ? (
          <div></div>
        ) : (
          <div className="sub-container sub-container-1">
            <div className="other-container">
              <label htmlFor="cliff-period">Cliff Period</label>
              <input
                type="text"
                name="cliffPeriod"
                id="cliff-period"
                className="input-box cliff-period "
                placeholder="Cliff Period"
                onChange={handleChange}
              />
              <div className="checkbox-container">
                <label>
                  <input
                    type="checkbox"
                    name="no-cliff-period"
                    id="no-cliff-period"
                    className="no-cliff-period"
                    style={{ margin: "5px" }}
                  />
                  No cliff period
                </label>
              </div>
            </div>
            <div className="other-container">
              <label htmlFor="start-time">Start Time</label>
              <input
                type="text"
                name="cliffStartDate"
                id="start-time"
                className="input-box start-time"
                placeholder="Start Time"
                onChange={handleChange}
              />
            </div>
            <div className="other-container">
              <label htmlFor="end-time">End Time</label>
              <input
                type="text"
                name="cliffEndDate"
                id="end-time"
                className="input-box end-time"
                placeholder="End Time"
                onChange={handleChange}
              />
            </div>
          </div>
        )}
      </div>
      <div className="btn-container">
        <button className="create-ivco-btn btn" onClick={onsubmit}>
          Create IVCO
        </button>
      </div>
    </div>
  );
};
