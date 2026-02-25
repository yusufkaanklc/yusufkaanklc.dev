import { registerCommand } from "@/core/commandRegistry";
import { socials as staticSocials } from "@/data/socials";
import { SocialLink } from "@/components/output/SocialLink";
import { commandListOutput } from "@/utils/commandHelpers";

registerCommand({
  name: "socials",
  description: "View social media links",
  handler: (_args, context) => {
    const socials = context.data?.socials ?? staticSocials;
    return {
      output: commandListOutput("social", "Social Links:", socials, (social) => (
        <SocialLink social={social} />
      )),
    };
  },
});
