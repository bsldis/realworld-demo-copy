import { fireEvent, render, screen } from "@testing-library/react";
import downloadMarkdown from "../../helpers/downloadMarkdown";
import DownloadButton from "./DownloadButton";

vi.mock("../../helpers/downloadMarkdown");

it("triggers a Markdown download of the article when clicked", () => {
  const article = {
    title: "Hello World",
    body: "Some body text.",
    slug: "hello-world",
  };

  render(<DownloadButton {...article} />);
  fireEvent.click(screen.getByRole("button", { name: /download/i }));

  expect(downloadMarkdown).toHaveBeenCalledWith(article);
});
