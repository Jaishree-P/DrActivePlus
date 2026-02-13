"use client";

import { useLocalStorage } from "./use-local-storage";
import { type ActivityLog } from "@/lib/types";
import { defaultActivityLog } from "@/lib/data";
import { v4 as uuidv4 } from "uuid";

export function useActivityLog() {
    const [logs, setLogs] = useLocalStorage<ActivityLog[]>("activity-log", defaultActivityLog);

    const logActivity = (action: string, details: string) => {
        const newLog: ActivityLog = {
            id: uuidv4(),
            timestamp: new Date().toISOString(),
            action,
            details,
        };
        // Add to the beginning of the array
        setLogs(prevLogs => [newLog, ...prevLogs]);
    };

    return { logs, logActivity };
}
