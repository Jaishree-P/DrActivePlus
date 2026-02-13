"use client";

import { useActivityLog } from "@/hooks/use-activity-log";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";

export default function ActivityLogPage() {
    const { logs } = useActivityLog();

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Activity Log</h1>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activities</CardTitle>
                    <CardDescription>A log of all changes made in the portal.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px]">Timestamp</TableHead>
                                <TableHead className="w-[200px]">Action</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs && logs.length > 0 ? (
                                logs.map((log) => (
                                    <TableRow key={log.id}>
                                        <TableCell>{format(new Date(log.timestamp), "yyyy-MM-dd, HH:mm:ss")}</TableCell>
                                        <TableCell className="font-medium">{log.action}</TableCell>
                                        <TableCell>{log.details}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        No activities logged yet.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
