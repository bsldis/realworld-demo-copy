import readingTime from "./readingTime";

// REQ-050: estimated reading time is derived from an article's body at 200
// words per minute, rounded up to the next whole minute, with a floor of
// "1 min read" so short/near-empty bodies never show 0 or a crash.

it("estimates reading time from word count at 200 words per minute", () => {
  const body = Array(400).fill("word").join(" ");

  expect(readingTime(body)).toBe("2 min read");
});

it("rounds a partial minute up to the next whole minute", () => {
  const body = Array(250).fill("word").join(" ");

  expect(readingTime(body)).toBe("2 min read");
});

it.each([
  ["an empty body", ""],
  ["a whitespace-only body", "   \n\t  "],
  ["a single-word body", "word"],
])("returns a minimum of 1 min read for %s", (_description, body) => {
  expect(readingTime(body)).toBe("1 min read");
});

it("does not crash or return NaN when no body is available yet", () => {
  expect(readingTime(undefined)).toBe("1 min read");
});

it("handles a very long body without crashing", () => {
  const body = Array(10000).fill("word").join(" ");

  expect(readingTime(body)).toBe("50 min read");
});
