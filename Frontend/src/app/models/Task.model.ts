export class ParentTask {
    _id?: string;
    parentTask: string;
}

export class Task {
    _id?: string
    parentTaskId: string;
    task: string;
    status?: string;
    priority: number;
    startDate: string;
    endDate: string
}