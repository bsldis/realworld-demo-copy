import { render, screen } from "@testing-library/react";
import ThemeProvider from "../../context/ThemeContext";
import ThemeToggle from "./ThemeToggle";

// Issue #1 (dark mode / theme toggle), pre-implementation: a control in the
// navbar lets a visitor switch themes at any time, on any page, without a
// page reload.

function mockMatchMedia(prefersDark) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: query === "(prefers-color-scheme: dark)" && prefersDark,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
  mockMatchMedia(false);
});

afterEach(() => {
  document.documentElement.removeAttribute("data-theme");
});

it("renders a control for switching themes", () => {
  renderToggle();

  expect(screen.getByRole("button", { name: /theme/i })).toBeInTheDocument();
});

it("switches the applied theme when clicked, without a page reload", () => {
  renderToggle();

  expect(document.documentElement.getAttribute("data-theme")).toBe("light");

  screen.getByRole("button", { name: /theme/i }).click();

  expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
});
