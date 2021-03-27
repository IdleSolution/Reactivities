import { observer } from 'mobx-react-lite'
import React, { useContext, useEffect } from 'react'
import { RouteComponentProps } from 'react-router'
import { Grid } from 'semantic-ui-react'
import LoadingComponent from '../../app/layout/LoadingComponent'
import { RootStoreContext } from '../../app/stores/rootStore'
import { ProfileContent } from './ProfileContent'
import ProfileHeader from './ProfileHeader'

interface RouteParams {
    username: string
}

interface IProps extends RouteComponentProps<RouteParams> {}

export const ProfilePage: React.FC<IProps> = observer(({match}) => {
    const rootStore = useContext(RootStoreContext);
    const { loadingProfile, loadProfile} = rootStore.profileStore;

    useEffect(() => {
        loadProfile(match.params.username);
    }, [loadProfile, match])

    if(loadingProfile) return <LoadingComponent content='Loading profile...'/>

    return (
        <Grid>
            <Grid.Column width={16}>
                <ProfileHeader/>
                <ProfileContent />
            </Grid.Column>
        </Grid>
    )
})
