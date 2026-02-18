import { registerCommand } from "@/core/commandRegistry";
import { themes, type ThemeName } from "@/types/theme";

registerCommand({
  name: "theme",
  description: "Change terminal theme",
  usage: "theme <name>",
  handler: (args, context) => {
    const name = args[0];
    const themeNames = Object.keys(themes) as ThemeName[];

    if (!name) {
      return {
        output: [
          {
            id: `theme-current-${Date.now()}`,
            type: "component",
            component: (
              <div className="space-y-2">
                <p>
                  <span className="text-fg-dim">Current theme: </span>
                  <span className="text-accent font-bold">{themes[context.theme as ThemeName]?.label ?? context.theme}</span>
                </p>
                <p className="text-fg-dim">Available themes:</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {themeNames.map((t) => (
                    <div
                      key={t}
                      className="flex items-center gap-2 px-2 py-1 rounded border border-fg-dim/15 bg-bg-secondary/50"
                    >
                      <div className="flex gap-0.5">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themes[t].accent }} />
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: themes[t].accentSecondary }} />
                      </div>
                      <span className={`text-xs ${t === context.theme ? "text-accent font-bold" : "text-fg-muted"}`}>
                        {themes[t].label}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="text-fg-dim text-xs">Usage: theme &lt;name&gt;</p>
              </div>
            ),
          },
        ],
      };
    }

    if (!(name in themes)) {
      return {
        output: [
          {
            id: `theme-err-${Date.now()}`,
            type: "error",
            content: `Unknown theme: '${name}'. Available: ${themeNames.join(", ")}`,
          },
        ],
      };
    }

    context.setTheme(name as ThemeName);
    const t = themes[name as ThemeName];
    return {
      output: [
        {
          id: `theme-set-${Date.now()}`,
          type: "component",
          component: (
            <div className="flex items-center gap-3">
              <div className="flex gap-1">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.accent }} />
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.accentSecondary }} />
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.green }} />
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: t.yellow }} />
              </div>
              <span className="text-accent italic">Theme changed to &apos;{t.label}&apos;</span>
            </div>
          ),
        },
      ],
    };
  },
});
