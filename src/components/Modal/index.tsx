import { useEffect } from "react";
import useKeyPress from "../../hooks/useKeyPress";
import "./index.css";

const Modal = ({
  onClose,
  iframeSource,
  title,
  content,
}: {
  onClose: () => void;
  content: JSX.Element;
  iframeSource?: string;
  title?: string;
}) => {
  const closePress = useKeyPress("Escape");

  useEffect(() => {
    if (closePress) onClose();
  }, [closePress, onClose]);

  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="modalHeader">
          {title && <h3>{title}</h3>}
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
