import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ArticleMeta from "./ArticleMeta";

const author = { username: "jake" };
const createdAt = "2020-01-01T12:11:08.212Z";

function renderMeta(props) {
  return render(
    <MemoryRouter>
      <ArticleMeta author={author} createdAt={createdAt} {...props} />
    </MemoryRouter>,
  );
}

// REQ-040: this must keep passing unchanged while the reading-time badge
// (REQ-050) is added alongside it.
it("renders the article's creation date exactly as before", () => {
  renderMeta({ body: "Some article body." });

  expect(screen.getByText("January 1, 2020")).toBeInTheDocument();
});

// REQ-050 (not yet implemented): expected to fail until ArticleMeta renders
// a reading-time estimate derived from the body prop.
it("shows an estimated reading time derived from the article body", () => {
  const body = Array(400).fill("word").join(" ");

  renderMeta({ body });

  expect(screen.getByText("2 min read")).toBeInTheDocument();
});

// REQ-050 (not yet implemented): expected to fail until ArticleMeta renders
// a reading-time estimate derived from the body prop.
it("shows a minimum of 1 min read for a near-empty body", () => {
  renderMeta({ body: "" });

  expect(screen.getByText("1 min read")).toBeInTheDocument();
});
