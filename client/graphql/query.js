// import { gql, useQuery } from '@apollo/client';
// import { ApolloClient, InMemoryCache } from '@apollo/client';

const ApolloClientLibrary = require('apollo-client');
const { URI } = require('../constants/constants');

const client = new ApolloClientLibrary.ApolloClient({
  // uri: 'https://api.thegraph.com/subgraphs/name/gulshanvas/ivco-goerli',
  uri: URI,
  // cache: ApolloClientLibrary.InMemoryCache()
});

const GET_TOKENS = gql`
  query Tokens {
    tokens(first: 5, where: { name_contains: "Two" }) {
      id
      address
      name
      symbol
    }
  }
`;

client
  .query({
    query: GET_TOKENS,
  })
  .then((result) => console.log('response from getting tokens', result));

// Reference :
// https://www.apollographql.com/docs/react/
// https://www.apollographql.com/docs/react/get-started/
// https://www.apollographql.com/docs/react/data/queries/
