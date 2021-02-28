import React from "react";
import "./Content.scss";
import { useQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";
import { ethers, Contract } from "ethers";
import { Timer } from "./Timer";
// hard cap
// rate
// start time
// end time
// vesting Start
// cliff period
// vesting duriation

const getTokens = gql`
  query Tokens {
    crowdsales {
      id
      vestingStart
      vestingEnd
      cliffDuration
      crowdsaleStart
      crowdsaleEnd
      hardcap
      token {
        name
        symbol
        decimals
      }
    }
  }
`;

export const Content = () => {
  const { loading, error, data } = useQuery(getTokens);

  const unixTimeConverter = (unixDate) => {
    return new Date(unixDate * 1000).toLocaleDateString("en-US");
  };
  const unixtohours = (unixtime) => {
    return unixtime / 3600;
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "30vh",
        }}
      >
        <h1 style={{ color: "white" }}>Loading...</h1>
      </div>
    );
  } else if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "30vh",
        }}
      >
        <h1>Error</h1>
      </div>
    );
  } else {
    const cardValues = data.crowdsales;
    return (
      <div className="content-container">
        <div className="tags"></div>
        <div className="card-container">
          {cardValues.map((eachCard) => {
            return (
              <Link
                to={`/${eachCard.id}`}
                style={{ textDecoration: "none", color: "white" }}
              >
                <div className="card card1" key={eachCard.id}>
                  <div className="name-logo-container">
                    <div>{eachCard.token.symbol}</div>
                    <div>{eachCard.token.name}</div>
                  </div>
                  <div className="table-container">
                    <table className="card-table">
                      <tr>
                        <th></th>
                        <th></th>
                      </tr>
                      <tr>
                        <td className="left-data">Hard Cap</td>
                        <td className="right-data">
                          {parseFloat(
                            ethers.utils.formatUnits(
                              eachCard.hardcap.toString(),
                              eachCard.token.decimals
                            )
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="left-data">Start time</td>
                        <td className="right-data">
                          {unixTimeConverter(eachCard.crowdsaleStart)}
                        </td>
                      </tr>
                      <tr>
                        <td className="left-data">End time</td>
                        <td className="right-data">
                          {eachCard.crowdsaleEnd == 0
                            ? "End Manually "
                            : unixTimeConverter(eachCard.crowdsaleEnd)}
                        </td>
                      </tr>
                      <tr>
                        <td className="left-data">Vesting Start</td>
                        <td className="right-data">
                          {eachCard.vestingStart == 0
                            ? "End Manually "
                            : unixTimeConverter(eachCard.vestingStart)}
                        </td>
                      </tr>
                      <tr>
                        <td className="left-data">Cliff duration</td>
                        <td className="right-data">
                          {eachCard.cliffDuration == 0
                            ? "End Manually"
                            : eachCard.cliffDuration}
                        </td>
                      </tr>
                      <tr>
                        <td className="left-data">Vesting Period</td>
                        <td className="right-data">
                          {eachCard.vestingEnd - eachCard.vestingStart == 0
                            ? "End Manually"
                            : eachCard.vestingEnd - eachCard.vestingStart}
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }
};
