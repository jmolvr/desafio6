import styles from './buttoncarregarmais.module.scss';

interface CarregarMaisButtonProps {
  onClick: () => void;
}

export function CarregarMaisButton({
  onClick,
}: CarregarMaisButtonProps): JSX.Element {
  return (
    <button className={styles.container} type="button" onClick={onClick}>
      Carregar mais posts
    </button>
  );
}
