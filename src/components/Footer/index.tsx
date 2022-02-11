import { MdEmail, MdChat } from "react-icons/md";
import { SiTelegram, SiDiscord } from "react-icons/si";

import "./index.css";

const Footer = () => {
  return (
    <footer>
      <p className="footerRiskNotice">
        Risk notification: Our code is based on top audited sources, but our
        changes are unaudited from 3rd party auditors. We improve security but a
        lot of things are out of our control, for example, 3rd party software
        like WordPress, your server's software, your hosting provider. We have
        delivered dapps for hundreds of clients which handle tens of thousands
        of users. For the past 3 years, we have received about 10 incident
        reports kind of "a user lost funds". Unfortunately, not all of them have
        been resolved. Ask yourself who other than you can access your server?
        When was your last time installing security updates? The most secure
        choice would be our cloud solution (with a "revenue-share" payment
        model) contact support for more information. For WP standalone versions
        please use as less plugins as you can and the "Simply Static plugin" and
        "Wodefence" for security.
      </p>

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
