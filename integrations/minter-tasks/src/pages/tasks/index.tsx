import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  IconButton,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useTonAddress } from "@tonconnect/ui-react";
import { useSearchParams } from "react-router-dom";
import { Screen, ScreenContent } from "components/Screen";
import useNotification from "hooks/useNotification";
import { AppButton } from "components/appButton";
import useTasksStore from "store/tasks-store/useTasksStore";
import {
  StyledEmpty,
  StyledFormRow,
  StyledPanel,
  StyledStats,
  StyledTasksContainer,
  StyledToolbar,
  TaskDescription,
  TaskMain,
  TaskMeta,
  TaskRow,
  TaskTitle,
} from "./styled";

type Filter = "all" | "active" | "done";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "done", label: "Completed" },
];

export const TasksPage = () => {
  const { showNotification } = useNotification();
  const walletAddress = useTonAddress();
  const [searchParams] = useSearchParams();
  const jettonFromQuery = searchParams.get("jetton") ?? "";

  const { tasks, stats, addTask, toggleTask, removeTask, clearCompleted } = useTasksStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [jettonMaster, setJettonMaster] = useState(jettonFromQuery);
  const [bindWallet, setBindWallet] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [scopedOnly, setScopedOnly] = useState(false);

  const hasContext = Boolean(jettonFromQuery) || Boolean(walletAddress);

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (filter === "active" && task.done) return false;
      if (filter === "done" && !task.done) return false;
      if (scopedOnly) {
        const matchesJetton = Boolean(jettonFromQuery) && task.jettonMaster === jettonFromQuery;
        const matchesWallet = Boolean(walletAddress) && task.walletAddress === walletAddress;
        if (!matchesJetton && !matchesWallet) return false;
      }
      return true;
    });
  }, [tasks, filter, scopedOnly, jettonFromQuery, walletAddress]);

  const handleAdd = () => {
    const created = addTask({
      title,
      description,
      jettonMaster: jettonMaster.trim() || undefined,
      walletAddress: bindWallet && walletAddress ? walletAddress : undefined,
    });

    if (!created) {
      showNotification("Task title is required", "error");
      return;
    }

    setTitle("");
    setDescription("");
    setBindWallet(false);
    showNotification("Task added", "success");
  };

  return (
    <Screen>
      <ScreenContent>
        <StyledTasksContainer>
          <Box>
            <Typography sx={{ fontWeight: 800, color: "#161C28", fontSize: 36 }}>Tasks</Typography>
            <Typography sx={{ color: "#7A828A", fontSize: 15, mt: 0.5 }}>
              Plan and track your Jetton deployment work. Tasks are stored locally in your browser.
            </Typography>
          </Box>

          <StyledPanel>
            <Typography sx={{ fontWeight: 800, color: "#161C28", fontSize: 20, mb: 2 }}>
              New task
            </Typography>
            <StyledFormRow>
              <TextField
                fullWidth
                size="small"
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAdd();
                }}
                sx={{ flex: 2, minWidth: 220 }}
              />
              <TextField
                fullWidth
                size="small"
                label="Description (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                sx={{ flex: 3, minWidth: 220 }}
              />
            </StyledFormRow>

            <StyledFormRow sx={{ mt: 2, alignItems: "center" }}>
              <TextField
                fullWidth
                size="small"
                label="Jetton master address (optional)"
                value={jettonMaster}
                onChange={(e) => setJettonMaster(e.target.value)}
                sx={{ flex: 2, minWidth: 220 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={bindWallet}
                    disabled={!walletAddress}
                    onChange={(e) => setBindWallet(e.target.checked)}
                  />
                }
                label={
                  walletAddress
                    ? "Bind to connected wallet"
                    : "Connect a wallet to bind it to this task"
                }
              />
              <AppButton onClick={handleAdd} width={160} height={40}>
                <AddRoundedIcon fontSize="small" /> Add task
              </AppButton>
            </StyledFormRow>
          </StyledPanel>

          <StyledPanel>
            <StyledToolbar>
              <Tabs
                value={filter}
                onChange={(_e, value: Filter) => setFilter(value)}
                textColor="primary"
                indicatorColor="primary">
                {FILTERS.map((item) => (
                  <Tab key={item.value} label={item.label} value={item.value} />
                ))}
              </Tabs>

              <StyledStats>
                <Chip size="small" label={`Total: ${stats.total}`} />
                <Chip size="small" color="primary" label={`Active: ${stats.active}`} />
                <Chip size="small" label={`Completed: ${stats.done}`} />
              </StyledStats>
            </StyledToolbar>

            <StyledToolbar>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={scopedOnly}
                    disabled={!hasContext}
                    onChange={(e) => setScopedOnly(e.target.checked)}
                  />
                }
                label={
                  hasContext
                    ? "Show only tasks for the current Jetton / wallet"
                    : "Open a Jetton or connect a wallet to filter by context"
                }
              />
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  size="small"
                  onClick={clearCompleted}
                  disabled={stats.done === 0}
                  sx={{ textTransform: "none" }}>
                  Clear completed
                </Button>
              </Box>
            </StyledToolbar>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, mt: 1 }}>
              {visibleTasks.length === 0 && (
                <StyledEmpty>
                  <Typography sx={{ fontWeight: 600, mb: 0.5 }}>No tasks here yet</Typography>
                  <Typography variant="body2">
                    Create your first task above to get started.
                  </Typography>
                </StyledEmpty>
              )}

              {visibleTasks.map((task) => (
                <TaskRow key={task.id} done={task.done}>
                  <Checkbox
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                    sx={{ mt: -0.5 }}
                  />
                  <TaskMain>
                    <TaskTitle done={task.done}>{task.title}</TaskTitle>
                    {task.description && (
                      <TaskDescription variant="body2">{task.description}</TaskDescription>
                    )}
                    <TaskMeta>
                      {task.jettonMaster && (
                        <Chip
                          size="small"
                          variant="outlined"
                          label={`Jetton: ${task.jettonMaster}`}
                          sx={{ maxWidth: 260 }}
                        />
                      )}
                      {task.walletAddress && (
                        <Chip
                          size="small"
                          variant="outlined"
                          label={`Wallet: ${task.walletAddress}`}
                          sx={{ maxWidth: 260 }}
                        />
                      )}
                    </TaskMeta>
                  </TaskMain>
                  <Tooltip title="Delete task">
                    <IconButton onClick={() => removeTask(task.id)} size="small">
                      <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TaskRow>
              ))}
            </Box>
          </StyledPanel>
        </StyledTasksContainer>
      </ScreenContent>
    </Screen>
  );
};

export default TasksPage;
