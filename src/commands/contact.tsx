import { registerCommand } from "@/core/commandRegistry";
import { ContactForm } from "@/components/output/ContactForm";

registerCommand({
  name: "contact",
  description: "View contact information",
  handler: () => ({
    output: [
      {
        id: `contact-${Date.now()}`,
        type: "component",
        component: <ContactForm />,
      },
    ],
  }),
});
