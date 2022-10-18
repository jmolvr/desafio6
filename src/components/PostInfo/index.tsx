import { FiUser, FiCalendar } from 'react-icons/fi';
import Link from 'next/link';
import styles from './postinfo.module.scss';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}
interface PostInfoProps {
  post: Post;
}

export function PostInfo({ post }: PostInfoProps): JSX.Element {
  return (
    <div className={styles.postContainer}>
      <Link href={`/post/${post.uid}`}>
        <a>
          <div className={styles.heading}>
            <h1>{post.data.title}</h1>
            <p>{post.data.subtitle}</p>
          </div>

          <div className={styles.info}>
            <div className={styles.infoSection}>
              <FiCalendar color="#BBBBBB" />
              <p>{post.first_publication_date}</p>
            </div>

            <div className={styles.infoSection}>
              <FiUser color="#BBBBBB" />
              <p>{post.data.author}</p>
            </div>
          </div>
        </a>
      </Link>
    </div>
  );
}
