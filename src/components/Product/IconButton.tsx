const IconButton = ({
  name,
  icon,
  alt,
  onClick,
  inactive,
}: {
  name: string;
  icon: string;
  alt: string;
  onClick: () => void;
  inactive?: boolean;
}) => {
  return (
    <button className={`transparentButton ${inactive ? "inactive" : ""}`} onClick={onClick}>
      <img className="tokenIcon" src={icon} alt={alt} />
      {name}
    </button>
  );
};

export default IconButton;
