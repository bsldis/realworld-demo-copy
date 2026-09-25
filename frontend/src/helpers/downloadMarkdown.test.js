import downloadMarkdown from "./downloadMarkdown";

let link;
let createObjectURL;
let revokeObjectURL;

beforeEach(() => {
  link = { click: vi.fn(), href: "", download: "" };
  vi.spyOn(document, "createElement").mockReturnValue(link);

  // jsdom doesn't implement URL.createObjectURL/revokeObjectURL at all, so
  // there's nothing for vi.spyOn to wrap — stub them directly instead.
  createObjectURL = vi.fn().mockReturnValue("blob:mock-url");
  revokeObjectURL = vi.fn();
  URL.createObjectURL = createObjectURL;
  URL.revokeObjectURL = revokeObjectURL;
});

afterEach(() => {
  document.createElement.mockRestore();
  delete URL.createObjectURL;
  delete URL.revokeObjectURL;
});

it("downloads the article's title and body as a Markdown file named after its slug", async () => {
  const article = {
    title: "Hello World",
    body: "Some **body** text.",
    slug: "hello-world",
  };

  downloadMarkdown(article);

  const blob = createObjectURL.mock.calls[0][0];
  expect(blob.type).toBe("text/markdown");
  expect(await blob.text()).toBe(`# ${article.title}\n\n${article.body}`);

  expect(link.href).toBe("blob:mock-url");
  expect(link.download).toBe(`${article.slug}.md`);
  expect(link.click).toHaveBeenCalledTimes(1);
  expect(revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
});

// The article body is already authored as Markdown (see markdown-to-jsx
// rendering in Article.jsx) — downloadMarkdown must pass it through
// byte-for-byte, not re-format or escape it.
test.each([
  ["a level-2 subtitle", "## A subtitle\n\nSome text under it."],
  ["a level-3 subtitle", "### A smaller subtitle\n\nMore text."],
  ["an unordered list", "Intro text.\n\n- First item\n- Second item\n- Third item"],
  [
    "mixed subtitles and a list",
    "## Overview\n\n- Point one\n- Point two\n\n### Details\n\nMore prose.",
  ],
])("preserves %s in the downloaded body unchanged", async (_label, body) => {
  const article = { title: "Formatted Article", body, slug: "formatted-article" };

  downloadMarkdown(article);

  const blob = createObjectURL.mock.calls[0][0];
  expect(await blob.text()).toBe(`# ${article.title}\n\n${body}`);
});
