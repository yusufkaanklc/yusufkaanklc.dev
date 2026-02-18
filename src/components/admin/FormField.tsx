"use client";

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs text-fg-dim font-medium uppercase tracking-wider">{label}</label>
      {children}
      {error && <p className="text-xs text-t-red">{error}</p>}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <FormField label={label} error={error}>
      <input
        {...props}
        className="w-full px-3 py-2.5 rounded-lg bg-bg-secondary/80 border border-fg-dim/12 text-fg text-sm outline-none focus:border-accent/40 focus:bg-bg-secondary transition-all placeholder:text-fg-dim/40"
      />
    </FormField>
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
}

export function TextArea({ label, error, ...props }: TextAreaProps) {
  return (
    <FormField label={label} error={error}>
      <textarea
        {...props}
        className="w-full px-3 py-2.5 rounded-lg bg-bg-secondary/80 border border-fg-dim/12 text-fg text-sm outline-none focus:border-accent/40 focus:bg-bg-secondary transition-all min-h-[100px] resize-y placeholder:text-fg-dim/40"
      />
    </FormField>
  );
}
