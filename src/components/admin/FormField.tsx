"use client";

interface FormFieldProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm text-fg-muted">{label}</label>
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
        className="w-full px-3 py-2 rounded bg-bg-secondary border border-fg-dim/20 text-fg text-sm outline-none focus:border-accent/50 transition-colors"
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
        className="w-full px-3 py-2 rounded bg-bg-secondary border border-fg-dim/20 text-fg text-sm outline-none focus:border-accent/50 transition-colors min-h-[80px] resize-y"
      />
    </FormField>
  );
}
