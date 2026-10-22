import { vi } from "vitest";
import { render, waitFor } from "@testing-library/react";
import { Jetton } from ".";

const mocks = vi.hoisted(() => ({
  getJettonDetails: vi.fn(),
  invalidateJettonDetails: vi.fn(),
  showNotification: vi.fn(),
  selectedAddress: null as string | null,
}));

vi.mock("@tonconnect/ui-react", () => ({
  useTonAddress: () => "",
}));

vi.mock("hooks/useJettonAddress", () => ({
  useJettonAddress: () => ({
    isAddressEmpty: false,
    jettonAddress: "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM9c",
  }),
}));

vi.mock("hooks/useNotification", () => ({
  default: () => ({ showNotification: mocks.showNotification }),
}));

vi.mock("store/jetton-store/useJettonStore", () => ({
  default: () => ({
    getJettonDetails: mocks.getJettonDetails,
    invalidateJettonDetails: mocks.invalidateJettonDetails,
  }),
}));

vi.mock("react-router-dom", async () => ({
  ...await vi.importActual<typeof import("react-router-dom")>("react-router-dom"),
  useSearchParams: () => [
    new URLSearchParams(mocks.selectedAddress ? { address: mocks.selectedAddress } : {}),
  ],
}));

vi.mock("components/Screen", () => ({
  Screen: ({ children }: { children: React.ReactNode }) => children,
  ScreenContent: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock("pages/jetton/dataRow/token", () => ({ Token: () => null }));
vi.mock("pages/jetton/styled", () => ({
  StyledContainer: ({ children }: { children: React.ReactNode }) => children,
}));
vi.mock("pages/jetton/wallet", () => ({ Wallet: () => null }));
vi.mock("./FaultyDeploy", () => ({ default: () => null }));

beforeEach(() => {
  mocks.getJettonDetails.mockReset();
  mocks.invalidateJettonDetails.mockReset();
  mocks.showNotification.mockReset();
  mocks.selectedAddress = null;
});

test("reloads jetton details when the selected wallet query parameter changes", async () => {
  const view = render(<Jetton />);

  await waitFor(() => expect(mocks.getJettonDetails).toHaveBeenCalledTimes(1));

  mocks.selectedAddress = "0:1111111111111111111111111111111111111111111111111111111111111111";
  view.rerender(<Jetton />);
  await waitFor(() => expect(mocks.getJettonDetails).toHaveBeenCalledTimes(2));

  mocks.selectedAddress = null;
  view.rerender(<Jetton />);
  await waitFor(() => expect(mocks.getJettonDetails).toHaveBeenCalledTimes(3));

  view.unmount();
  expect(mocks.invalidateJettonDetails).toHaveBeenCalledTimes(3);
});
