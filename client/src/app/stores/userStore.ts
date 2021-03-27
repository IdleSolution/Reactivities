import { action, computed, makeObservable, observable, runInAction } from "mobx";
import { history } from "../..";
import { IUser, IUserFormValues } from "../../modules/user";
import agent from "../api/agent";
import { RootStore } from "./rootStore";


export default class UserStore {
    rootStore: RootStore;

    constructor(rootStore: RootStore) {
        this.rootStore = rootStore;
        makeObservable(this);
    }
    
    @observable user: IUser | null = null;

    @computed get isLoggedIn() {
        return !!this.user
    }

    @action login = async (values: IUserFormValues) => {
        try {
            const user = await agent.User.login(values);
            runInAction(() => {
                this.user = user;
                this.rootStore.commonStore.setToken(user.token);
                this.rootStore.modalStore.closeModal();

            })
            history.replace('/activities');
        } catch(error) {
            throw error;
        }
    }

    @action register = async(values: IUserFormValues) => {
        try {
            const user = await agent.User.register(values);
            runInAction(() => {
                this.rootStore.commonStore.setToken(user.token);
                this.rootStore.modalStore.closeModal();
                history.replace('/activities');
            })
        } catch(error) {
            throw error;
        }
    }

    @action logout = () => {
        this.rootStore.commonStore.setToken(null);
        this.user = null;
        history.replace('/');
    }

    @action getUser = async () => {
        try {
            const user = await agent.User.current();
            runInAction(() => {
                this.user = user;
            })
        } catch(error) {
            console.log(error);
        }
    }


}

