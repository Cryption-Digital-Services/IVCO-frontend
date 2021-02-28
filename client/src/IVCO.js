import React from "react";
import { Content } from "./components/Content";
import { CreateIVCO } from "./components/CreateIVCO";
import { CardPage } from "./components/CardPage";
import { Header } from "./components/Header";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./IVCO.scss";
// import { URI } from '../constants/constants';
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { AdminPage } from "./components/AdminPage";
import { Vesting } from "./components/Vesting";
const client = new ApolloClient({
  uri: "https://api.thegraph.com/subgraphs/name/gulshanvas/ivco-matic",
  cache: new InMemoryCache(),
});

export const IVCO = ({ createLaunchpad, account, gettokeninfo, SIGNER }) => {
  return (
    <ApolloProvider client={client}>
      <Router>
        <Switch>
          <Route path="/" exact>
            <div className="not-navbar">
              <div className="home-page-container">
                <Header />
                <Content />{" "}
              </div>
            </div>
          </Route>
          <Route path="/createivco" exact>
            <CreateIVCO
              createLaunchpad={createLaunchpad}
              account={account}
              gettokeninfo={gettokeninfo}
            />
          </Route>
          <Route
            path="/admin/:id"
            render={({ match }) => (
              <AdminPage
                SIGNER={SIGNER}
                data1={match.params}
                account={account}
              />
            )}
          ></Route>
          <Route
            path="/vesting/:id"
            render={({ match }) => (
              <Vesting SIGNER={SIGNER} data1={match.params} account={account} />
            )}
          ></Route>
          <Route
            path="/:id"
            render={({ match }) => (
              <CardPage
                SIGNER={SIGNER}
                data1={match.params}
                account={account}
              />
            )}
          ></Route>
        </Switch>
      </Router>
    </ApolloProvider>
  );
};
