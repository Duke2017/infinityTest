import {
  OperationVariables,
  QueryHookOptions,
  QueryResult,
} from '@apollo/client';

import { InputMaybe, Scalars } from '@graphql-types';
import { GraphQLFormattedError } from 'graphql';

/**
 * Possible custom headers, allowed by backend
 */
export enum CustomAppHeaders {
  activeCompany = 'x-active-company',
}

/**
 * General interface with auth service methods,
 * that should be supplied to Apollo link to handle authorization
 */
export interface GqlAuthProvider {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

/**
 * Callback for handling errors inside requests
 */
export type HandleGqlError = (error: GraphQLFormattedError) => void;

/**
 * Shortcut type for any fragment
 */
export type AnyFragment = Record<string, any>;

/**
 * Default gql input for and ids filter
 */
export type DefaultIdInput = InputMaybe<
  Array<Scalars['ID']['input']> | Scalars['ID']['input']
>;

/**
 * General interface for query variables, that support relay style pagination
 */
export interface PaginatedQueryVariables extends OperationVariables {
  first?: InputMaybe<number> | undefined;
  after?: InputMaybe<string> | undefined;
}

/**
 * Query variables, that supports filtering by id
 */
export interface IdsQueryVariables<IdInput = DefaultIdInput> {
  ids?: IdInput;
}

/**
 * General interface for query variables, that support pagination, search and ids filtering
 * This is required for usage in selects
 */
export interface SearchablePaginatedQueryVariables<IdInput = DefaultIdInput>
  extends PaginatedQueryVariables,
    IdsQueryVariables<IdInput> {
  search?: InputMaybe<string> | undefined;
}

/**
 * Basic type for all generated Apollo query hooks
 */
type UseQuery<QueryData, QueryVariables extends OperationVariables> = (
  options: QueryHookOptions<QueryData, QueryVariables> & {
    variables: QueryVariables;
  }
) => QueryResult<QueryData, QueryVariables>;

/**
 * Type for any generated useSomePaginatedQuery hook, that supports pagination
 */
export type UsePaginatedQuery<
  QueryData,
  QueryVariables extends PaginatedQueryVariables,
> = UseQuery<QueryData, QueryVariables>;
