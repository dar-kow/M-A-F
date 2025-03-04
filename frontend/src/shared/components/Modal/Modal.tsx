import './Modal.scss';

interface ModalProps {
  children: React.ReactNode;
  className?: string;
}

const Modal = ({ children, className = '' }: ModalProps) => {
  return (
    <div className={`modal ${className}`.trim()}>{children}</div>
  );
};

export default Modal;