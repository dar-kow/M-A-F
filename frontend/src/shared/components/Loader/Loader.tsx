import './Loader.scss';

interface LoaderProps {
  size?: 'small' | 'medium' | 'large';
}

function Loader({ size = 'medium' }: LoaderProps) {
  return (
    <div className={`loader-container ${size}`}>
      <div className="loader"></div>
    </div>
  );
}

export default Loader;