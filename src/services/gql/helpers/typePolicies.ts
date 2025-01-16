import { TypedTypePolicies } from '../__generated__/typedTypePolicies';

export const typePolicies = {
  Query: {
    fields: {
      repositoryOwner: {
        keyArgs: ['login'],
      },
    },
  },
  RepositoryOwner: {
    fields: {
      repositories: {
        keyArgs: false,
        merge(existing = {}, incoming) {
          const nodes = existing?.nodes || [];
          const newNodes = incoming?.nodes || [];
          return {
            ...incoming,
            nodes: [...nodes, ...newNodes],
          };
        },
      },
    },
  },
} satisfies TypedTypePolicies;
