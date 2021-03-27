import React, { useEffect, useContext, Fragment } from 'react';
import { Container } from 'semantic-ui-react';
import Navbar from '../../features/nav/Navbar';
import { ActivityDashboard } from '../../features/activities/dashboard/ActivityDashboard';
import { observer } from 'mobx-react-lite';
import { Route, RouteComponentProps, Switch, withRouter } from 'react-router-dom';
import { HomePage } from '../../features/home/HomePage';
import { ActivityForm } from '../../features/activities/form/ActivityForm';
import { ActivityDetails } from '../../features/activities/details/ActivityDetails';
import { NotFound } from './NotFound';
import { ToastContainer } from 'react-toastify';
import { LoginForm } from '../../features/user/LoginForm';
import { RootStoreContext } from '../stores/rootStore';
import LoadingComponent from './LoadingComponent';
import { ModalContainer } from '../common/modals/ModalContainer';
import { ProfilePage } from '../../features/profile/ProfilePage';
import { PrivateRoute } from './PrivateRoute';


const App: React.FC<RouteComponentProps> = ({location}) => {
	const rootStore = useContext(RootStoreContext);
	const { setAppLoaded, token, appLoaded } = rootStore.commonStore;
	const { getUser } = rootStore.userStore;

	useEffect(() => {
		if(token) {
			getUser().finally(() => setAppLoaded());
		} else {
			setAppLoaded();
		}
	}, [getUser, token, setAppLoaded])

	if(!appLoaded) return <LoadingComponent content={'Loading app...'} />

	return (
		<div>
			<ModalContainer />
			<ToastContainer position='bottom-right'/>
			<Route exact path='/' component={HomePage} />
			<Route path={'/(.+)'} render={() => (
				<Fragment>
					<Navbar />
					<Container style={{marginTop: '7em'}}>
						<Switch>
							<PrivateRoute exact path='/activities' component={ActivityDashboard} />
							<PrivateRoute exact path='/activities/:id' component={ActivityDetails} />
							<PrivateRoute key={location.key} exact path={['/createActivity', '/manage/:id']} component={ActivityForm} />
							<PrivateRoute path='/login' exact component={LoginForm}/>
							<PrivateRoute exact path='/profile/:username' component={ProfilePage}/>
							<Route component={NotFound}/>
						</Switch>
					</Container>
				</Fragment>
			)}/>
		</div>
	);

}

export default withRouter(observer(App));

