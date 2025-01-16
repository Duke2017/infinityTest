'use client';
import { RepoCard } from '@/entities/repositories';
import { useRepositoriesByOwnerQuery } from '@/entities/repositories/gql/queries/repositoriesByOwner.graphql';
import { Input } from '@/shared/components/ui/Input';
import { Spinner } from '@/shared/components/ui/Spinner';
import { useState, useCallback } from 'react';
import { InView } from 'react-intersection-observer';

export const ReposExplorer = () => {
  const [login, setLogin] = useState('');

  const {
    data,
    loading: isLoading,
    fetchMore,
  } = useRepositoriesByOwnerQuery({
    variables: {
      login,
      cursor: null,
    },
    notifyOnNetworkStatusChange: true,
    skip: !login,
  });

  const hasNextPage = data?.repositoryOwner?.repositories.pageInfo.hasNextPage;
  const endCursor =
    data?.repositoryOwner?.repositories.pageInfo.endCursor || null;
  const repos = data?.repositoryOwner?.repositories.nodes;

  const loadMoreRepos = useCallback(() => {
    fetchMore({
      variables: {
        cursor: endCursor,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newEntries =
          fetchMoreResult.repositoryOwner?.repositories.nodes || [];
        const endCursor =
          fetchMoreResult.repositoryOwner?.repositories.pageInfo.endCursor;
        const hasNextPage =
          fetchMoreResult.repositoryOwner?.repositories.pageInfo.hasNextPage ??
          false;
        return {
          repositoryOwner: {
            repositories: {
              pageInfo: {
                endCursor,
                hasNextPage,
              },
              nodes: [
                ...(previousResult.repositoryOwner?.repositories.nodes || []),
                ...newEntries,
              ],
            },
          },
        };
      },
    });
  }, [endCursor, fetchMore]);

  return (
    <div className="flex flex-col gap-8 w-full max-w-prose">
      <Input
        {...{
          name: 'login',
          label: 'Логин GitHub',
          placeholder: 'Введите логин для поиска репозиториев',
          value: login,
          onChange: e => setLogin(e.target.value),
        }}
      />
      {!!repos?.length && (
        <div className="flex flex-col gap-3">
          {repos?.map(repo =>
            repo ? (
              <RepoCard
                key={repo.id}
                {...{
                  repo,
                }}
              />
            ) : null
          )}
        </div>
      )}
      {!!login && !isLoading && !repos?.length && <p>Репозитории не найдены</p>}
      {isLoading && <Spinner className="self-center" />}
      {hasNextPage && login && !isLoading && (
        <InView
          onChange={inView => {
            if (inView) {
              loadMoreRepos();
            }
          }}
        />
      )}
    </div>
  );
};
