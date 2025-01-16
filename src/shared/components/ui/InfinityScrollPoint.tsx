import { InView } from 'react-intersection-observer';

interface InfinityScrollPointProps {
  hasNextPage: boolean;
  endCursor: string | null;
  fetchMore: (options: { variables: { cursor: string | null } }) => void;
}

export const InfinityScrollPoint: React.FC<InfinityScrollPointProps> = ({
  hasNextPage,
  endCursor,
  fetchMore,
}) => {
  const loadMoreRepos = () => {
    fetchMore({
      variables: {
        cursor: endCursor,
      },
    });
  };

  return hasNextPage ? (
    <InView onChange={inView => inView && loadMoreRepos()} />
  ) : null;
};
