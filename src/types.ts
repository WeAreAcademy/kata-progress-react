export interface Kata {
    id: string;
    url: string;
    name: string;
    status?: string;
    difficulty?: string;
    createdTime?: string;
    lastEditedTime?: string;
}
export interface DecoratedKata {
    kata: Kata;
    progress?: KataProgress;
}
export interface KataProgress {
    is_done: boolean;
    is_stuck: boolean;
    is_in_progress: boolean;
}
export interface KataProgressData {
    kata_id: string;
    user_id: string;
    is_done: boolean;
    is_stuck: boolean;
    is_in_progress: boolean;
}

export interface SimpleUser {
    id: string;
    display_name: string;
    email: string;
}
export interface SimpleUserWithCounts extends SimpleUser {
    number_of_katas: number;
}

export interface IStatusChange {
    isDone?: boolean;
    isStuck?: boolean;
    isInProgress?: boolean;
}
