import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Segment, Image, Item, Header, Button } from 'semantic-ui-react';
import { IActivity } from '../../../modules/activity';
import { format } from 'date-fns'
import { RootStoreContext } from '../../../app/stores/rootStore';

const activityImageStyle = {
    filter: 'brightness(30%)'
};

const activityImageTextStyle = {
    position: 'absolute',
    bottom: '5%',
    left: '5%',
    width: '100%',
    height: 'auto',
    color: 'white'
};

export const ActivityDetailedHeader: React.FC<{ activity: IActivity }> = observer(({ activity }) => {
    const rootStore = useContext(RootStoreContext);
    const host = activity.attendees.filter(x => x.isHost)[0];
    const { attendActivity, cancelAttendance, loading } = rootStore.activityStore;
    console.log(activity.category);
    return (
        <Segment.Group>
            <Segment basic attached='top' style={{ padding: '0' }}>
                <Image
                    src={`/assets/categories/${activity.category}.jpg`}
                    fluid
                    style={activityImageStyle}
                />
                <Segment basic style={activityImageTextStyle}>
                    <Item.Group>
                        <Item>
                            <Item.Content>
                                <Header
                                    size='huge'
                                    content={activity.title}
                                    style={{ color: 'white' }}
                                />
                                <p>{format(activity.date, 'eeee do MMMM')}</p>
                                <p>
                                    Hosted by <Link to={`/profile/${host.username}`}>{host.displayName}</Link>
                                </p>
                            </Item.Content>
                        </Item>
                    </Item.Group>
                </Segment>
            </Segment>
            <Segment clearing attached='bottom'>
                {activity.isHost ? (
                    <Button
                    color='orange'
                    floated='right'
                    as={Link}
                    to={`/manage/${activity.id}`}
                    >
                        Manage Event
                    </Button>
                ) : activity.isGoing ? (
                    <Button loading={loading} onClick={cancelAttendance}>
                        Cancel attendance
                    </Button>
                ) : (
                    <Button loading={loading} color='teal' onClick={attendActivity}>
                        Join Activity
                    </Button>
                )}
            </Segment>
        </Segment.Group>
    )
})
