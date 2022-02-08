import { MdEmail, MdChat } from "react-icons/md";
import { SiTelegram, SiDiscord } from "react-icons/si";

import "./index.css";

const Footer = () => {
  return (
    <footer>
      <ul className="linksList">
        <li className="linkItem">
          <a
            href="mailto:support@onout.org"
            target="_blank"
            rel="noreferrer"
            title="Email: support@onout.org"
          >
            <MdEmail className="icon" />
          </a>
        </li>
        <li className="linkItem">
          <a
            href="https://support.onout.org/chat/widget/form/3882717100"
            target="_blank"
            rel="noreferrer"
            title="Online chat"
          >
            <MdChat className="icon" />
          </a>
        </li>
        <li className="linkItem">
          <a
            href="https://t.me/onoutsupportbot"
            target="_blank"
            rel="noreferrer"
            title="Telegram"
          >
            <SiTelegram className="icon" />
          </a>
        </li>
        <li className="linkItem">
          <a
            href="https://discord.gg/VwKEmHEgVN"
            target="_blank"
            rel="noreferrer"
            title="Discord"
          >
            <SiDiscord className="icon" />
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
