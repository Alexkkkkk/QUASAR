import { vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { EditLogoPopup } from "./EditLogoPopup";

const mocks = vi.hoisted(() => ({ logoUrl: "" }));

vi.mock("hooks/useJettonLogo", () => ({
  useJettonLogo: () => ({
    jettonLogo: { logoUrl: mocks.logoUrl },
    setLogoUrl: vi.fn(),
  }),
}));

test("updates an open editor when the metadata logo URL arrives", () => {
  const props = {
    showPopup: true,
    tokenImage: { description: "Logo URL" },
    close: vi.fn(),
  };
  const view = render(<EditLogoPopup {...props} />);

  expect(screen.getByRole("textbox")).toHaveValue("");

  mocks.logoUrl = "https://example.com/logo.png";
  view.rerender(<EditLogoPopup {...props} />);

  expect(screen.getByRole("textbox")).toHaveValue("https://example.com/logo.png");
});

test("does not overwrite user input when metadata arrives later", () => {
  mocks.logoUrl = "";
  const props = {
    showPopup: true,
    tokenImage: { description: "Logo URL" },
    close: vi.fn(),
  };
  const view = render(<EditLogoPopup {...props} />);

  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "https://example.com/draft.png" },
  });
  mocks.logoUrl = "https://example.com/source.png";
  view.rerender(<EditLogoPopup {...props} />);

  expect(screen.getByRole("textbox")).toHaveValue("https://example.com/draft.png");
});
