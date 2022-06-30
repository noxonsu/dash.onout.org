const IconButton = ({
  name,
  icon,
  alt,
  onClick,
  active,
  inactive,
}: {
  name: string;
  icon: string;
  alt: string;
  onClick: () => void;
  active?: boolean;
  inactive?: boolean;
}) => {
  return (
    <button className={`transparentButton ${active ? "active" : ""} ${inactive ? "inactive" : ""}`} onClick={onClick}>
      <img className="tokenIcon" src={icon} alt={alt} />
      {name}
    </button>
  );
};

export default IconButton;
