
export function sendReminderEmail(to: string, subject: string, body: string) {
  const mailtoLink = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  // This will attempt to open the user's default email client.
  // This action might be blocked by the browser's pop-up blocker if not triggered by a direct user action.
  window.location.href = mailtoLink;
}
