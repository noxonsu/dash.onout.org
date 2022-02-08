import { useEffect } from "react";
import useKeyPress from "../../hooks/useKeyPress";
import "./index.css";

const Modal = ({
  onClose,
  iframeSource,
  iframeTitle,
}: {
  onClose: () => void;
  iframeSource?: string;
  iframeTitle?: string;
}) => {
  const closePress = useKeyPress("Escape");

  useEffect(() => {
    if (closePress) onClose();
  }, [closePress, onClose]);

  return (
    <div className="modalOverlay">
      <div className="modal">
        <div className="modalHeader">
          {iframeTitle && <h3>{iframeTitle}</h3>}
          <button className="secondaryBtn" onClick={onClose}>
            Close
          </button>
        </div>

        {iframeSource && iframeTitle && (
          <iframe
            title={iframeTitle}
            src={iframeSource}
            frameBorder="0"
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default Modal;
