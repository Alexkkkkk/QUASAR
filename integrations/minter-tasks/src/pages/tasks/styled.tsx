import { Box, styled, Typography } from "@mui/material";

const StyledTasksContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(3),
  width: "100%",
  marginTop: theme.spacing(3),
}));

const StyledPanel = styled(Box)(({ theme }) => ({
  background: "#FFFFFF",
  border: "0.5px solid rgba(114, 138, 150, 0.24)",
  borderRadius: 24,
  filter: "drop-shadow(0px 2px 16px rgba(114, 138, 150, 0.08))",
  padding: theme.spacing(3),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const StyledFormRow = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(2),
  alignItems: "flex-start",
  flexWrap: "wrap",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
  },
}));

const StyledToolbar = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: theme.spacing(2),
  flexWrap: "wrap",
  marginBottom: theme.spacing(2),
}));

const StyledStats = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  flexWrap: "wrap",
}));

const TaskRow = styled(Box, {
  shouldForwardProp: (prop) => prop !== "done",
})<{ done?: boolean }>(({ done }) => ({
  display: "flex",
  alignItems: "flex-start",
  gap: 10,
  padding: "12px 14px",
  borderRadius: 16,
  border: "1px solid rgba(114, 138, 150, 0.18)",
  background: done ? "rgba(0, 152, 234, 0.06)" : "#F7F9FB",
  transition: "background 0.15s ease",
}));

const TaskMain = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  flex: 1,
  minWidth: 0,
});

const TaskTitle = styled(Typography, {
  shouldForwardProp: (prop) => prop !== "done",
})<{ done?: boolean }>(({ done }) => ({
  fontSize: 16,
  fontWeight: 600,
  color: "#161C28",
  wordBreak: "break-word",
  textDecoration: done ? "line-through" : "none",
  opacity: done ? 0.6 : 1,
}));

const TaskDescription = styled(Typography)({
  fontSize: 14,
  color: "#7A828A",
  wordBreak: "break-word",
});

const TaskMeta = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(0.5),
  flexWrap: "wrap",
  marginTop: 2,
}));

const StyledEmpty = styled(Box)({
  padding: "40px 20px",
  textAlign: "center",
  color: "#7A828A",
});

export {
  StyledTasksContainer,
  StyledPanel,
  StyledFormRow,
  StyledToolbar,
  StyledStats,
  TaskRow,
  TaskMain,
  TaskTitle,
  TaskDescription,
  TaskMeta,
  StyledEmpty,
};
