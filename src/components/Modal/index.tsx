import { useEffect } from "react";
import useKeyPress from "../../hooks/useKeyPress";
import "./index.css";

const Modal = ({
  onClose,
  title,
  content,
  style,
}: {
  onClose: () => void;
  content: JSX.Element;
  title?: string;
  style?: { [k: string]: string };
}) => {
  const closePress = useKeyPress("Escape");

  useEffect(() => {
    if (closePress) onClose();
  }, [closePress, onClose]);

  return (
    <div className="modalOverlay">
      <div className="modal" style={style}>
        <div className="modalHeader">
          {title && <h3 className="modalTitle">{title}</h3>}
          <button className="secondaryBtn" onClick={onClose}>
            Close
          </button>
        </div>

        {content}
      </div>
    </div>
  );
};

export default Modal;
