export function shareTwitter(url: string, title: string) {
  window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    "_blank",
    "width=600,height=400"
  );
}

export function shareLinkedIn(url: string) {
  window.open(
    `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    "_blank",
    "width=600,height=400"
  );
}

export function copyLink(url: string, setCopied: (v: boolean) => void) {
  navigator.clipboard.writeText(url).then(() => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  });
}
