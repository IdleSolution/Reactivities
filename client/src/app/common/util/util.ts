import { IActivity, IAttendee } from "../../../modules/activity";
import { IUser } from "../../../modules/user";

export const setActivityProps = (activity: IActivity, user: IUser) => {
    activity.date = new Date(activity.date);
    activity.isGoing = activity.attendees.some(
        a => a.username === user.username
    )

    activity.isHost = activity.attendees.some(
        a => a.username === user.username && a.isHost
    )

    return activity;
}

export const createAttendee = (user: IUser): IAttendee => {
    return {
        isHost: false,
        displayName: user.displayName,
        username: user.username,
        image: user.image!
    }
}