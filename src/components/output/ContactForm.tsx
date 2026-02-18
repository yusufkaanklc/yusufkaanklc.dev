import { contact } from "@/data/contact";

export function ContactForm() {
  return (
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
  );
}
