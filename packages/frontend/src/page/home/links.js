import { ReactComponent as Discord } from "../../static/svg/discord.svg";
import { ReactComponent as Twitter } from "../../static/svg/twitter.svg";
import { ReactComponent as Telegram } from "../../static/svg/telegram.svg";

export const LOGO_LIST = [
  {
    url: "https://t.me/BabyLaeeb_CN",
    name: "Telegram",
    icon: (
      <Telegram className="w-8 h-8" />
    ),
  },
  {
    url: "https://twitter.com/BabyLaeeb",
    name: "Twitter",
    icon: (
      <Twitter className="w-8 h-8" />
    ),
  },
  {
    url: "https://discord.gg/PkzasyZBAb",
    name: "Discord",
    icon: (
      <Discord className="w-8 h-8" />
    ),
  },
];


export default () => {
  return (
    <div className="flex gap-3">
       {LOGO_LIST.map((i) => (
          <div className="footer-icon" onClick={() => window.open(i.url)}>
            {i.icon}
          </div>
        ))}
    </div>
  )
}