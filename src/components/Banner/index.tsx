import styles from './banner.module.scss';

interface BannerProps {
  url: string;
}

export function Banner({ url }: BannerProps): JSX.Element {
  return (
    <div className={styles.bannercontainer}>
      <img src={url} alt="Banner" />
    </div>
  );
}
