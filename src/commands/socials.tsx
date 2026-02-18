import { registerCommand } from "@/core/commandRegistry";
import { socials } from "@/data/socials";
import { SocialLink } from "@/components/output/SocialLink";

registerCommand({
  name: "socials",
  description: "View social media links",
  handler: () => ({
    output: [
      {
        id: `socials-header-${Date.now()}`,
        type: "component",
        component: <p className="text-accent font-bold mb-2">Social Links:</p>,
      },
      ...socials.map((social, i) => ({
        id: `social-${i}-${Date.now()}`,
        type: "component" as const,
        component: <SocialLink social={social} />,
      })),
    ],
  }),
});
