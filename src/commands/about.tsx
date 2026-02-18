import { registerCommand } from "@/core/commandRegistry";
import { profile } from "@/data/profile";

registerCommand({
  name: "about",
  description: "About me",
  handler: () => ({
    output: [
      {
        id: `about-${Date.now()}`,
        type: "component",
        component: (
          <div className="space-y-2">
            <p className="text-accent font-bold text-lg">{profile.name}</p>
            <p className="text-fg-dim">{profile.title}</p>
            <p className="text-fg-muted">{profile.bio}</p>
            <p className="text-sm text-fg-dim">Location: {profile.location}</p>
          </div>
        ),
      },
    ],
  }),
});
