import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Icon, Item, Label, Segment } from 'semantic-ui-react'
import { IActivity } from '../../../modules/activity'
import { format } from 'date-fns'
import { ActivityListItemAtendees } from './ActivityListItemAtendees'

export const ActivityListItem: React.FC<{ activity: IActivity }> = ({ activity }) => {
    const host = activity.attendees.filter(x => x.isHost)[0];
    return (
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src={(host && host.image) || '/assets/user-placeholder.png'} style={{margin: 3}} />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>{activity.title}</Item.Header>
                            {host && (
                                <Item.Description>
                                    Hosted by <Link to={`profile/${host.username}`}>{host.displayName}</Link>
                                </Item.Description>
                            )}

                            {activity.isHost && 
                            <Item.Description>
                                <Label basic color='orange' content='You are hosting this activity'/>    
                            </Item.Description>}
                            {activity.isGoing && !activity.isHost && 
                            <Item.Description>
                                <Label basic color='green' content='You are going to this event'/>    
                            </Item.Description>}
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <Icon name='clock' /> {format(activity.date, 'h:mm a')}
                <Icon name='marker' /> {activity.venue}, {activity.city}
            </Segment>
            <Segment secondary>
                <ActivityListItemAtendees attendees={activity.attendees}/>
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button as={Link} to={`/activities/${activity.id}`} floated="right" content="View" color="blue" />
            </Segment>
        </Segment.Group>
    )
}
