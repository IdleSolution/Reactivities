import { observer } from 'mobx-react-lite'
import React, { Fragment, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Item, Label, List, Segment, Image } from 'semantic-ui-react'
import { RootStoreContext } from '../../../app/stores/rootStore'

export const ActivityDetailedSidebar = observer(() => {
    var rootStore = useContext(RootStoreContext);
    const attendees = rootStore.activityStore.activity?.attendees!;
    return (
        <Fragment>
            <Segment
                textAlign='center'
                style={{ border: 'none' }}
                attached='top'
                secondary
                inverted
                color='teal'
            >
                {attendees.length} {attendees.length === 1 ? 'Person' : 'People'} Going
            </Segment>
            <Segment attached>
                <List relaxed divided>
                    {attendees.map(attendee => (

                        <Item style={{ position: 'relative' }}>
                            {attendee.isHost && (
                                <Label
                                    style={{ position: 'absolute' }}
                                    color='orange'
                                    ribbon='right'
                                >
                                    Host
                                </Label>
                            )}
                            <Image size='tiny' src={attendee.image || '/assets/user-placeholder.png'} />
                            <Item.Content verticalAlign='middle'>
                                <Item.Header as='h3'>
                                    <Link to={`/profile/${attendee.username}`}>{attendee.displayName}</Link>
                                </Item.Header>
                                {attendee.following && (
                                    <Item.Extra style={{ color: 'orange' }}>Following</Item.Extra>
                                )}
                            </Item.Content>
                        </Item>
                    ))}

                </List>
            </Segment>
        </Fragment>
    )
})
