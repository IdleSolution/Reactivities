import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom';
import { Grid } from 'semantic-ui-react'
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { ActivityDetailedChat } from './ActivityDetailedChat';
import { ActivityDetailedHeader } from './ActivityDetailedHeader';
import { ActivityDetailedInfo } from './ActivityDetailedInfo';
import { ActivityDetailedSidebar } from './ActivityDetailedSidebar';


interface DetailsParams {
    id: string
}

export const ActivityDetails: React.FC<RouteComponentProps<DetailsParams>> = observer(({ match, history }) => {
    const root = useContext(RootStoreContext);
    const { activity, loadingInitial, loadActivity } = root.activityStore

    useEffect(() => {
        loadActivity(match.params.id);
    }, [loadActivity, match.params.id])

    if (loadingInitial || !activity) return <LoadingComponent content='Loading activity...' />

    return (
        <Grid>
            <Grid.Column width={10}>
                <ActivityDetailedHeader activity={activity}/>
                <ActivityDetailedInfo activity={activity}/>
                <ActivityDetailedChat />
            </Grid.Column>

            <Grid.Column width={6}>
                <ActivityDetailedSidebar/>
            </Grid.Column>
        </Grid>
    )
})
