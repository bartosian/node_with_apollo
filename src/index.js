import 'dotenv/config';

import 'cross-fetch/polyfill';
import ApolloClient, { gql } from 'apollo-boost';

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  request: operation => {
    operation.setContext({
      headers: {
        authorization: `Bearer ${process.env.GITHUB_PERSONAL_ACCESS_TOKEN}`,
      }
    });
  }
});

const GET_REPOSITORIES_OF_ORGANIZATION = gql`
  query(
    $organization: String!,
    $cursor: String) {
    organization(login: $organization) {
      name
      url
      repositories(first: 10, after: $cursor, orderBy: {field: STARGAZERS, direction: ASC}) {
        edges {
          node {
            ...RepositoryNode
            id
          }
        }
        pageInfo {
          endCursor
          hasNextPage
        }
      }
    }
  }

  fragment RepositoryNode on Repository {
    name
    url
  }
`;

const ADD_STAR = gql`
  mutation AddStar($repositoryId: ID!) {
    addStar(input: { starrableId: $repositoryId }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

const REMOVE_STAR = gql`
  mutation RemoveStar($repositoryId: ID!) {
    removeStar(input: { starrableId: $repositoryId }) {
      starrable {
        id
        viewerHasStarred
      }
    }
  }
`;

client
  .query({
    query: GET_REPOSITORIES_OF_ORGANIZATION,
    variables: {
      organization: 'the-road-to-learn-react',
      cursor: 'Y3Vyc29yOnYyOpICzgh92MQ='
    }
  })
  .then((result) => {
    console.log(result);
  });

client
  .mutate({
    mutation: ADD_STAR,
    variables: {
      repositoryId: 'MDEwOlJlcG9zaXRvcnk2MzM1MjkwNw==',
    }
  })
  .then(console.log);

  client
    .mutate({
      mutation: REMOVE_STAR,
      variables: {
        repositoryId: 'MDEwOlJlcG9zaXRvcnk2MzM1MjkwNw==',
      }
    })
    .then(console.log);

const userCredentials = { firstname: 'Robin' };
const userDetails = { nationality: 'German' };

const user = {
  ...userCredentials,
  ...userDetails,
};

console.log(user);

console.log(process.env.SOME_ENV_VARIABLE);
