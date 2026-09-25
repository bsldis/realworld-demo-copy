import { act, render, screen } from "@testing-library/react";
import ThemeProvider, { useTheme } from "./ThemeContext";

// Issue #1 (dark mode / theme toggle), pre-implementation: defaults to the
// stored preference if one exists, otherwise the OS/browser
// prefers-color-scheme setting, and exposes a way to switch themes that
// persists the explicit choice to localStorage.

function mockMatchMedia(prefersDark) {
  window.matchMedia = vi.fn().mockImplementation((query) => ({
    matches: query === "(prefers-color-scheme: dark)" && prefersDark,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }));
}

function Consumer() {
  const { theme, toggleTheme } = useTheme();

  return (
    <>
      <span>current theme: {theme}</span>
      <button onClick={toggleTheme}>toggle</button>
    </>
  );
}

function renderWithProvider() {
  return render(
    <ThemeProvider>
      <Consumer />
    </ThemeProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  document.documentElement.removeAttribute("data-theme");
});

it("defaults to the light theme when nothing is stored and the OS does not prefer dark", () => {
  mockMatchMedia(false);

  renderWithProvider();

  expect(screen.getByText("current theme: light")).toBeInTheDocument();
  expect(document.documentElement.getAttribute("data-theme")).toBe("light");
});

it("defaults to the dark theme when nothing is stored and the OS prefers dark", () => {
  mockMatchMedia(true);

  renderWithProvider();

  expect(screen.getByText("current theme: dark")).toBeInTheDocument();
  expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
});

it("prefers a previously stored theme over the OS preference", () => {
  mockMatchMedia(false);
  localStorage.setItem("theme", "dark");

  renderWithProvider();

  expect(screen.getByText("current theme: dark")).toBeInTheDocument();
});

it("switches the active theme and persists the explicit choice to localStorage", () => {
  mockMatchMedia(false);

  renderWithProvider();

  act(() => {
    screen.getByRole("button", { name: "toggle" }).click();
  });

  expect(screen.getByText("current theme: dark")).toBeInTheDocument();
  expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
  expect(localStorage.getItem("theme")).toBe("dark");
});
