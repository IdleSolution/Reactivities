import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import { action, observable, computed, makeObservable, runInAction, reaction } from 'mobx';
import { SyntheticEvent } from 'react';
import { toast } from 'react-toastify';
import { IActivity } from '../../modules/activity';
import agent from '../api/agent';
import { createAttendee, setActivityProps } from '../common/util/util';
import { history } from './../../index';
import { RootStore } from './rootStore';

const LIMIT = 2;

export default class ActivityStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);

        reaction(
            () => this.predicate.keys(),
            () => {
                this.page = 0;
                this.activityRegistry.clear();
                this.loadActivities();
            }
        )
    }


    @observable activityRegistry = new Map();
    @observable activity: IActivity | null = null;
    @observable loadingInitial = false;
    @observable submitting = false;
    @observable target = '';
    @observable loading = false;
    @observable.ref hubConnection: HubConnection | null = null;
    @observable activityCount = 0;
    @observable page = 0;
    @observable predicate = new Map();

    @computed get totalPages() {
        return Math.ceil(this.activityCount / LIMIT);
    }

    @computed get axiosParams() {
        const params = new URLSearchParams();
        params.append('limit', String(LIMIT));
        params.append('offset', `${this.page ? this.page * LIMIT : 0}`);
        this.predicate.forEach((value, key) => {
            if (key === 'startDate') {
                params.append(key, value.toISOString());
            } else {
                params.append(key, value);
            }
        })
        return params;
    }

    @action setPage = (page: number) => {
        this.page = page;
    }

    @action setPredicate = (predicate: string, value: string | Date) => {
        this.predicate.clear();
        if(predicate !== 'all') {
            this.predicate.set(predicate, value);
        }
    }


    @action createHubConnection = () => {
        this.hubConnection = new HubConnectionBuilder()
            .withUrl(process.env.REACT_APP_API_CHAT_URL!, {
                accessTokenFactory: () => this.rootStore.commonStore.token!
            })
            .configureLogging(LogLevel.Information)
            .build();
        this.hubConnection.start()
            .then(() => console.log(this.hubConnection!.state))
            .then(() => {
                this.hubConnection!.invoke('AddToGroup', this.activity!.id)
            })
            .catch(e => console.log(e));

        this.hubConnection.on("ReceiveComment", comment => {
            runInAction(() => {
                this.activity!.comments.push(comment);
            })
        })
    }

    @action stopHubConnection = () => {
        this.hubConnection!.invoke("RemoveFromGroup", this.activity!.id)
            .then(() => this.hubConnection!.stop())
            .catch(error => console.log(error));
    }

    @action addComment = async (values: any) => {
        console.log("XP");
        values.activityId = this.activity!.id;
        try {
            await this.hubConnection!.invoke('SendComment', values);
        } catch(error) {
            console.log(error);
        }
    }

    @computed get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activityRegistry.values()));
    }

    groupActivitiesByDate(activities: IActivity[]) {
        const sortedActivities = activities.sort(
            (a, b) => a.date.getTime() - b.date.getTime()
        )

        return Object.entries(sortedActivities.reduce((activities, activity) => {
            const date = activity.date.toISOString().split('T')[0];
            activities[date] = activities[date] ? [...activities[date], activity] : [activity];
            return activities;
        }, {} as { [key: string]: IActivity[] }))
    }


    @action loadActivities = async () => {
        this.loadingInitial = true;

        try {
            const activitiesEnvelope = await agent.Activities.list(this.axiosParams);
            const {activities, activityCount} = activitiesEnvelope;
            runInAction(() => {
                activities.forEach(activity => {
                    setActivityProps(activity, this.rootStore.userStore.user!);

                    this.activityRegistry.set(activity.id, activity);
                })
                this.activityCount = activityCount;
                this.loadingInitial = false;
            })
        } catch (error) {
            runInAction(() => {
                this.loadingInitial = false;
            })
            console.log(error);

        }
    }


    @action createActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.create(activity);
            const attendee = createAttendee(this.rootStore.userStore.user!);
            attendee.isHost = true;
            let attendees = [];
            attendees.push(attendee);
            activity.attendees = attendees;
            activity.comments = [];
            activity.isHost = true;
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.submitting = false;
            })
            history.replace(`/activities/${activity.id}`)

        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            })
            toast.error("Problem submitting data");

        }
    }

    @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.activity = activity;
                this.submitting = false;
            })
            history.replace(`/activities/${activity.id}`)
        } catch (error) {
            runInAction(() => {
                this.submitting = false;
            })
            toast.error("Problem submitting data");

        }

    }

    @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
        this.submitting = true;
        this.target = event.currentTarget.name;
        console.log(this.target);
        try {
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                this.submitting = false;
                this.target = '';
            })

        } catch (error) {
            runInAction(() => {
                this.submitting = false;
                this.target = '';
            })
            console.log(error);
        }
    }

    @action loadActivity = async (id: string) => {
        let activity = this.getActivity(id);
        if (activity) {
            this.activity = activity;
            return activity;
        } else {
            this.loadingInitial = true;
            try {
                activity = await agent.Activities.details(id);
                runInAction(() => {
                    setActivityProps(activity, this.rootStore.userStore.user!);
                    this.activity = activity;
                    this.activityRegistry.set(activity.id, activity);
                    this.loadingInitial = false;
                })
                return activity;

            } catch (error) {
                runInAction(() => {
                    this.loadingInitial = false;
                })
                console.log(error)
            }
        }
    }

    @action clearActivity = () => {
        this.activity = null;
    }


    getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }


    @action attendActivity = () => {
        const attendee = createAttendee(this.rootStore.userStore.user!);
        this.loading = true;

        try {
            agent.Activities.attend(this.activity!.id);
            runInAction(() => {
                if (this.activity) {
                    this.activity.attendees.push(attendee);
                    this.activity.isGoing = true;
                    this.activityRegistry.set(this.activity.id, this.activity);
                    this.loading = false;
                }
            })
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            })
            toast.error('Problem signing up to activity')
        }


    }

    @action cancelAttendance = () => {
        this.loading = true;
        try {
            agent.Activities.unattend(this.activity!.id);
            runInAction(() => {
                if (this.activity) {
                    this.activity.attendees = this.activity.attendees.filter(x => x.username !== this.rootStore.userStore.user?.username);
                    this.activity.isGoing = false;
                    this.activityRegistry.set(this.activity.id, this.activity);
                    this.loading = false;

                }
            })
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            })
            toast.error('Problem cancelling attendance')
        }


    }

}
