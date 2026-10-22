import { vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { TasksPage } from ".";

const mocks = vi.hoisted(() => ({ addTask: vi.fn(), showNotification: vi.fn() }));

vi.mock("@tonconnect/ui-react", () => ({
  useTonAddress: () => "",
}));

vi.mock("hooks/useNotification", () => ({
  default: () => ({ showNotification: mocks.showNotification }),
}));

vi.mock("store/tasks-store/useTasksStore", () => ({
  default: () => ({
    tasks: [],
    stats: { total: 0, active: 0, done: 0 },
    addTask: mocks.addTask,
    toggleTask: vi.fn(),
    removeTask: vi.fn(),
    clearCompleted: vi.fn(),
  }),
}));

vi.mock("components/Screen", () => ({
  Screen: ({ children }: { children: React.ReactNode }) => children,
  ScreenContent: ({ children }: { children: React.ReactNode }) => children,
}));

const TasksWithQueryNavigation = () => {
  const navigate = useNavigate();

  return (
    <>
      <button type="button" onClick={() => navigate("/tasks?jetton=jetton-b")}>
        Open Jetton B
      </button>
      <TasksPage />
    </>
  );
};

const renderTasksPage = () =>
  render(
    <MemoryRouter initialEntries={["/tasks?jetton=jetton-a"]}>
      <TasksWithQueryNavigation />
    </MemoryRouter>,
  );

const addTask = (title: string) => {
  fireEvent.change(screen.getByLabelText("Title"), { target: { value: title } });
  fireEvent.click(screen.getByRole("button", { name: "Add task" }));
};

beforeEach(() => {
  mocks.addTask.mockReset();
  mocks.addTask.mockReturnValue({ id: "task-id" });
  mocks.showNotification.mockReset();
});

test("uses the new query jetton as the default for a task after navigation", async () => {
  renderTasksPage();

  expect(screen.getByLabelText("Jetton master address (optional)")).toHaveValue("jetton-a");

  fireEvent.click(screen.getByRole("button", { name: "Open Jetton B" }));

  await waitFor(() =>
    expect(screen.getByLabelText("Jetton master address (optional)")).toHaveValue("jetton-b"),
  );

  addTask("Bound to Jetton B");

  expect(mocks.addTask).toHaveBeenCalledWith({
    title: "Bound to Jetton B",
    description: "",
    jettonMaster: "jetton-b",
    walletAddress: undefined,
  });
});

test("keeps a manually entered master address when the query jetton changes", async () => {
  renderTasksPage();

  const jettonMasterInput = screen.getByLabelText("Jetton master address (optional)");
  fireEvent.change(jettonMasterInput, { target: { value: "manual-master" } });
  fireEvent.click(screen.getByRole("button", { name: "Open Jetton B" }));

  await waitFor(() => expect(jettonMasterInput).toHaveValue("manual-master"));

  addTask("Keep manual binding");

  expect(mocks.addTask).toHaveBeenCalledWith({
    title: "Keep manual binding",
    description: "",
    jettonMaster: "manual-master",
    walletAddress: undefined,
  });
});
