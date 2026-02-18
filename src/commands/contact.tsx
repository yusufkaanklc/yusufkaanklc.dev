import { registerCommand } from "@/core/commandRegistry";
import { contact as staticContact } from "@/data/contact";

registerCommand({
  name: "contact",
  description: "View contact information",
  handler: (_args, context) => {
    const contact = context.data?.contact ?? staticContact;
    return {
      output: [
        {
          id: `contact-${Date.now()}`,
          type: "component",
          component: (
            <div className="space-y-2">
              <p className="text-accent font-bold">Contact Information</p>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-accent">Email:</span>{" "}
                  <a href={`mailto:${contact.email}`} className="text-fg-muted hover:text-accent-secondary transition-colors underline">
                    {contact.email}
                  </a>
                </p>
                <p>
                  <span className="text-accent">Phone:</span>{" "}
                  <span className="text-fg-muted">{contact.phone}</span>
                </p>
                <p>
                  <span className="text-accent">Location:</span>{" "}
                  <span className="text-fg-muted">{contact.location}</span>
                </p>
                <p>
                  <span className="text-accent">Status:</span>{" "}
                  <span className="text-t-green">{contact.availability}</span>
                </p>
              </div>
            </div>
          ),
        },
      ],
    };
  },
});
