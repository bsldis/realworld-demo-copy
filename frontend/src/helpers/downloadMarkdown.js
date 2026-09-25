export default function downloadMarkdown({ title, body, slug }) {
  const content = `# ${title}\n\n${body}`;
  const blob = new Blob([content], { type: "text/markdown" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${slug}.md`;
  link.click();

  URL.revokeObjectURL(url);
}
