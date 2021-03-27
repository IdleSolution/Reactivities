import { observer } from 'mobx-react-lite';
import React, { useContext, useEffect } from 'react';
import { Tab, Grid, Header, Card } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';
import { ProfileCard } from './ProfileCard';

interface IProps {
    predicate: string;
}

export const ProfileFollowings: React.FC<IProps> = observer(({predicate}) => {
    const rootStore = useContext(RootStoreContext);
    const { profile, loading, followings, loadFollowings, followed } = rootStore.profileStore;

    useEffect(() => {
        loadFollowings(predicate);
    }, [loadFollowings, predicate, followed])

    return (
        <Tab.Pane loading={loading}>
            <Grid>
                <Grid.Column width={16}>
                    <Header
                        floated='left'
                        icon='user'
                        content={
                            predicate === 'followers'
                                ? `People following ${profile!.displayName}`
                                : `People ${profile!.displayName} is following`
                        }
                    />
                </Grid.Column>
                <Grid.Column width={16}>
                    <Card.Group itemsPerRow={5}>
                        {followings.map(profile => (
                            <ProfileCard key={profile.username} profile={profile} />
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    );
})
