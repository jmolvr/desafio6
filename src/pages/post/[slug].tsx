import { GetStaticPaths, GetStaticProps } from 'next';
import { FiCalendar, FiClock, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import * as prismicH from '@prismicio/helpers';
import { PrismicRichText } from '@prismicio/react';
import { useRouter } from 'next/router';
import { Banner } from '../../components/Banner';
import { getPrismicClient } from '../../services/prismic';
import commonStyles from '../../styles/common.module.scss';
import styles from './post.module.scss';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps {
  post: Post;
}

export default function Post({ post }: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return <h1>Carregando...</h1>;
  }
  function getWordCount(str): number {
    return str.trim().split(/\s+/).length;
  }
  function calcularTempoLeitura(): number {
    const initialValue = 0;
    const result = post.data.content.reduce((previousValue, currentContent) => {
      const text = prismicH.asText(currentContent.body);

      const numberofwords = getWordCount(text);

      return previousValue + numberofwords;
    }, initialValue);

    return Math.ceil(result / 200);
  }

  const tempoLeitura = calcularTempoLeitura();
  return (
    <div>
      <header>
        <Banner url={post?.data.banner.url} />
        <div className={commonStyles.container}>
          <h1 className={styles.title}>{post.data.title}</h1>
          <div className={styles.info}>
            <div className={styles.infoSection}>
              <FiCalendar color="#BBBBBB" />
              <p>{post.first_publication_date}</p>
            </div>
            <div className={styles.infoSection}>
              <FiUser color="#BBBBBB" />
              <p>{post.data.author}</p>
            </div>
            <div className={styles.infoSection}>
              <FiClock color="#BBBBBB" />
              <p>{tempoLeitura} min</p>
            </div>
          </div>
        </div>
      </header>
      <main className={commonStyles.container}>
        {post.data.content &&
          post.data.content.map(content => (
            <>
              <h1>{content.heading}</h1>
              <PrismicRichText field={content.body} />
            </>
          ))}
      </main>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient({});
  const response = await prismic.getByType('post');
  const posts = response.results;
  // TODO

  const paths = posts.map(post => {
    return { params: { slug: post.uid } };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;
  const prismic = getPrismicClient({});
  const response = await prismic.getByUID('post', String(slug));
  response.first_publication_date = format(
    new Date(response.first_publication_date),
    'dd MMM yyyy',
    {
      locale: ptBR,
    }
  );
  // TODO
  return {
    props: {
      post: response,
    },
  };
};
