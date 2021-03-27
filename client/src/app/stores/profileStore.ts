import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { toast } from "react-toastify";
import { IPhoto, IProfile, IProfileFormValues, IUserActivity } from "../../modules/profile";
import agent from "../api/agent";
import { RootStore } from "./rootStore";

export default class ProfileStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }

    @observable profile: IProfile | null = null;
    @observable loadingProfile = true;
    @observable uploadingPhoto = false;
    @observable loading = false;
    @observable followings: IProfile[] = [];
    @observable followed = false;
    @observable userActivities: IUserActivity[] = [];
    @observable loadingActivities = false;

    @computed get isCurrentUser () {
        if(this.rootStore.userStore.user && this.profile) {
            return this.rootStore.userStore.user.username === this.profile.username;
        } else {
            return false;
        }
    }


    @action loadProfile = async(username: string) => {
        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);
            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            })
        } catch(error) {
            runInAction(() => {
                this.loadingProfile = false;
                console.log(error);
            })
        }
    }

    @action loadUserActivities = async(username: string, predicate?: string) => {
        this.loadingActivities = true;
        try {
            const activities = await agent.Profiles.listActivities(username, predicate!);
            runInAction(() => {
                this.userActivities = activities;
                this.loadingActivities = false;
            })
        } catch(error) {
            toast.error('Problem loading activities');
            runInAction(() => {
                this.loadingActivities = false;
            })
        }
    }

    @action editProfile = async(values: IProfileFormValues) => {
        try {
            this.loading = true;
            await agent.Profiles.edit(values);
            runInAction(() => {
                this.profile!.bio = values.bio;
                this.profile!.displayName = values.displayName;
                this.rootStore.userStore.user!.displayName = values.displayName;
                this.loading = false;

            })
        } catch(error) {
            this.loading = false;
            throw error;
        }
    }

    @action uploadPhoto = async(file: Blob) => {
        this.uploadingPhoto = true;
        try {
            const photo = await agent.Profiles.uploadPhoto(file);
            runInAction(() => {
                if(this.profile) {
                    this.profile.photos.push(photo);
                    if(photo.isMain && this.rootStore.userStore.user) {
                        this.rootStore.userStore.user.image = photo.url;
                        this.profile.image = photo.url;
                    }
                }
                this.uploadingPhoto = false;
            })
        } catch(error) {
            runInAction(() => {
                this.uploadingPhoto = false;
            })
            toast.error('Problem uploading photo');
        }
    }

    @action setMainPhoto = async(photo: IPhoto) => {
        this.loading = true;
        try {
            await agent.Profiles.setMainPhoto(photo.id);
            runInAction(() => {
                this.rootStore.userStore.user!.image = photo.url;
                this.profile!.photos.find(a => a.isMain)!.isMain = false;
                this.profile!.photos.find(a => a.id === photo.id)!.isMain = true;
                this.profile!.image = photo.url;
                this.loading = false;
            })
        } catch (error) {
            runInAction(() => {
                this.loading = false;
            })
            toast.error('Problem setting main photo');
        }
    }

    @action deletePhoto = async(photo: IPhoto) => {
        this.loading = true;
        try {
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(() => {
                this.profile!.photos = this.profile!.photos.filter(a => a.id !== photo.id);
                this.loading = false;
            })
        } catch(error) {
            runInAction(() => {
                this.loading = false;
            })
            toast.error('Problem deleting the photo');
        }
    }

    @action follow = async (username: string) => {
        this.loading = true;
        try {
            await agent.Profiles.follow(username);
            runInAction(() => {
                this.profile!.following = true;
                this.profile!.followersCount++;
                this.loading = false;
                this.followed = !this.followed;
            })
        } catch(error) {
            toast.error('Problem following user');
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    @action unfollow = async (username: string) => {
        this.loading = true;
        try {
            await agent.Profiles.unfollow(username);
            runInAction(() => {
                this.profile!.following = false;
                this.profile!.followersCount--;
                this.followings = this.followings.filter(x => x.username !== this.rootStore.userStore.user!.username);
                this.loading = false;
            })
        } catch(error) {
            toast.error('Problem unfollowing user');
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    @action loadFollowings = async(predicate: string) => {
        this.loading = true;
        try {
            const profiles = await agent.Profiles.listFollowings(this.profile!.username, predicate);
            runInAction(() => {
                this.followings = profiles;
                this.loading = false;
            })
        } catch(error) {
            toast.error('Problem loading followings');
            runInAction(() => {
                this.loading = false;
            })
        }
    }

}