export interface IActivitiesEnvelope {
    activities: IActivity[];
    activityCount: number;
}

export interface IActivity {
    id: string;
    title : string;
    description: string;
    category : string;
    date: Date;
    city: string;
    venue: string;
    attendees: IAttendee[];
    isGoing: boolean;
    isHost: boolean;
    comments: IComment[]
}

export interface IComment {
    id: string;
    createdAt: Date;
    body: string;
    username: string;
    displayName: string;
    image: string;
}

export interface IActivityFormValues extends Partial<IActivity> {
    time?: Date;
}

export class ActivityFormValues implements IActivityFormValues {
    id?: string = undefined;
    title: string = '';
    category: string = '';
    description: string = '';
    date?: Date = undefined;
    city: string = '';
    venue: string = '';

    constructor(init?: IActivityFormValues) {
        Object.assign(this, init);
    }
}

export interface IAttendee {
    username: string;
    displayName: string;
    image: string;
    isHost: boolean;
    following?: boolean;
}