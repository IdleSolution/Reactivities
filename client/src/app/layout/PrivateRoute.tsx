import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Redirect, Route, RouteComponentProps, RouteProps } from 'react-router-dom'
import { RootStoreContext } from '../stores/rootStore'

interface IProps extends RouteProps {
    component: React.ComponentType<RouteComponentProps<any>>
}

export const PrivateRoute: React.FC<IProps> = observer(({component: Component, ...rest}) => {
    const token = window.localStorage.getItem('jwt');
    const rootStore = useContext(RootStoreContext);
    const { isLoggedIn } = rootStore.userStore;
    return (
        <Route {...rest} render={(props) => isLoggedIn && token ? <Component {...props}/> : <Redirect to={'/'}/>} />
    )
})
