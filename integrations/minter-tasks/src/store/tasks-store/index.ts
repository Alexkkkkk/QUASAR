import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

export interface Task {
  id: string;
  title: string;
  description?: string;
  done: boolean;
  createdAt: number;
  updatedAt?: number;
  /** Optional binding to a Jetton master address. */
  jettonMaster?: string;
  /** Optional binding to a wallet address. */
  walletAddress?: string;
}

export interface TasksStoreState {
  tasks: Task[];
}

/** localStorage key used by recoil-persist. */
const TASKS_PERSIST_KEY = "quasar:tasks";

const { persistAtom } = recoilPersist({ key: TASKS_PERSIST_KEY });

const tasksStateAtom = atom<TasksStoreState>({
  key: "tasksStateAtom",
  default: {
    tasks: [],
  },
  effects_UNSTABLE: [persistAtom],
});

export { tasksStateAtom, TASKS_PERSIST_KEY };
