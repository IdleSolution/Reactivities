import { observer } from 'mobx-react-lite';
import React, { useContext, useState } from 'react'
import { Grid, Header, Tab, Button } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore'
import { ProfileEditForm } from './ProfileEditForm';

export const ProfileDescription = observer(() => {
    const rootStore = useContext(RootStoreContext);
    const { profile, isCurrentUser } = rootStore.profileStore;
    const [editProfileMode, setEditProfileMode] = useState(false);
    return (
        <Tab.Pane>
            <Grid>
                <Grid.Column width={16} style={{paddingBottom: 0}} >
                    <Header floated='left' content='Bio' icon='user'/>
                    {profile && isCurrentUser && (
                        <Button floated='right' basic content={editProfileMode ? 'Cancel' : 'Edit'} 
                            onClick={() => setEditProfileMode(!editProfileMode)}/>
                    )}
                </Grid.Column>
                <Grid.Column width={16} >
                    {editProfileMode ? (
                        <ProfileEditForm setEditProfileMode={setEditProfileMode} profile={profile!}/>
                    ) : (
                        <p>{profile?.bio}</p>
                    )}
                </Grid.Column>
            </Grid>

        </Tab.Pane>
    )
})
