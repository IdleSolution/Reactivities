import { format } from 'date-fns';
import { observer } from 'mobx-react-lite';
import React, { Fragment, useContext } from 'react';
import { Item, Label } from 'semantic-ui-react';
import { RootStoreContext } from '../../../app/stores/rootStore';
import { ActivityListItem } from './ActivityListItem';


export const ActivityList: React.FC = observer(() => {
    const root = useContext(RootStoreContext);
    const { activitiesByDate } = root.activityStore;
    return (
        <Fragment>
            {activitiesByDate.map(x => (
                <Fragment key={x[0]} >
                    <Label size='large' color='blue'>
                        {format(x[0], 'eeee do MMMM')}
                    </Label>
                    <Item.Group divided>
                        {x[1].map(activity => (
                            <ActivityListItem key={activity.id} activity={activity} />
                        ))}

                    </Item.Group>
                </Fragment>
            ))}
        </Fragment>


    )
})
