import { GetStaticProps } from 'next';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { useState } from 'react';
import { CarregarMaisButton } from '../components/CarregarMaisButton';
import { PostInfo } from '../components/PostInfo';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const { results, next_page } = postsPagination;
  const [paginationPages, setPaginationsPage] = useState([]);

  async function fetchNewPages(): Promise<void> {
    const response = await fetch(next_page);
    const { results: newPages } = await response.json();
    setPaginationsPage(previousState => [...previousState, ...newPages]);
  }

  // TODO
  return (
    <div className={commonStyles.container}>
      <main className={styles.posts}>
        {results.map(post => (
          <PostInfo key={post.uid} post={post} />
        ))}
        {paginationPages.map(post => (
          <PostInfo key={post.uid} post={post} />
        ))}
      </main>
      {next_page && <CarregarMaisButton onClick={() => fetchNewPages()} />}
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient({});
  const postsResponse = await prismic.getByType('post', {
    pageSize: 2,
  });
  // TODO
  const posts = postsResponse.results.map(post => {
    return {
      ...post,
      first_publication_date: format(
        new Date(post.first_publication_date),
        'dd MMM yyyy',
        {
          locale: ptBR,
        }
      ),
    };
  });

  postsResponse.results = posts;
  return {
    props: {
      postsPagination: postsResponse,
    },
  };
};
