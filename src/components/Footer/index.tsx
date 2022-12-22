import GA from "react-ga";
import { MdEmail, MdChat } from "react-icons/md";
import { SiTelegram, SiDiscord } from "react-icons/si";
import { Link } from "react-router-dom";
import useUser from "../../hooks/useUser";
import Referal from "../Referal";

import "./index.css";

const Footer = () => {
  const {
    state: { signed, subscribed },
  } = useUser();

  const links = [
    {
      to: "mailto:support@onout.org",
      title: "Email: support@onout.org",
      icon: <MdEmail size="2rem" className="icon" />,
      gaAction: "Write Email support",
    },
    {
      to: "https://support.onout.org/chat/widget/form/3882717100",
      title: "Online chat",
      icon: <MdChat size="1.9rem" className="icon" />,
      gaAction: "Open Online chat support",
    },
    {
      to: "https://t.me/onoutsupportbot",
      title: "Telegram",
      icon: <SiTelegram size="1.7rem" className="icon" />,
      gaAction: "Open Telegram support bot",
    },
    {
      to: "https://discord.gg/VwKEmHEgVN",
      title: "Discord",
      icon: <SiDiscord size="1.9rem" className="icon" />,
      // icon: <SiDiscord size="1.9rem" className="icon" />,
      gaAction: "Join to Discord channel",
    },
  ];

  return (
    <footer>
      {signed && subscribed && (
        <div>
          {/* <Referal /> */}
          <ul className="footerItems">
            {/* <li className="footerItem">
              <Link to="/statistics" className="footerLink">
                Stats
              </Link>
            </li> */}
            <li className="footerItem">
              <a
                href="https://onout.org/sponsor.md"
                target="_blank"
                rel="noreferrer"
                className="footerLink"
              >
                Become a sponsor
              </a>
            </li>
            <li className="footerItem">
              <a
                href="https://t.me/onoutsupportbot"
                target="_blank"
                rel="noreferrer"
                className="footerLink"
              >
                Contact support
              </a>
            </li>
          </ul>
          <p className="footerRiskNotice">
            Risk notification: Our code is based on top audited sources (if not marked as another), but our
            changes are unaudited from 3rd party auditors. We have delivered dapps for hundreds of clients which
            handle tens of thousands of users. For the past 3 years, we have
            received about 10 incident reports kind of "a user lost funds".
            Unfortunately, not all of them have been resolved. For WP standalone versions please use
            as less plugins as you can and the "Simply Static plugin" and
            "Wodefence" for security. All products are licensed under MIT license (free for copy, modify and without warranty) . 
            We provide insurance on smartcontracts, this means if smartcontract has a bug and funds were stolen 
            then we will return up to 10000 USD but from future sales of this product. 
          </p>
        </div>
      )}

      <ul className="linksList">
        {links.map(({ to, title, icon, gaAction }, index) => (
          <li className="linkItem" key={index}>
            <a
              href={to}
              target="_blank"
              rel="noreferrer"
              title={title}
              onClick={() => {
                GA.event({
                  category: "Social links",
                  action: gaAction,
                });
              }}
            >
              {icon}
            </a>
          </li>
        ))}
      </ul>
    </footer>
  );
};

export default Footer;
