import React, { useContext, useEffect } from 'react'
import { useState } from 'react'
import { Button, Form, Grid, Segment } from 'semantic-ui-react'
import { ActivityFormValues } from '../../../modules/activity'
import { v4 as uuid } from 'uuid';
import { observer } from 'mobx-react-lite';
import { RouteComponentProps } from 'react-router-dom';
import { Form as FinalForm, Field } from 'react-final-form';
import { TextInput } from '../../../app/common/form/TextInput';
import { TextArea } from '../../../app/common/form/TextArea';
import { SelectInput } from '../../../app/common/form/SelectInput';
import { category } from '../../../app/common/options/categoryOptions';
import { DateInput } from '../../../app/common/form/DateInput';
import { combineValidators, composeValidators, hasLengthGreaterThan, isRequired } from 'revalidate';
import { RootStoreContext } from '../../../app/stores/rootStore';

const validate = combineValidators({
    title: isRequired('Title'),
    category: isRequired('Category'),
    description: composeValidators(
        isRequired('Description'),
        hasLengthGreaterThan(4)({message: 'Description needs to be at least 5 characters'})
    )(),
    city: isRequired('City'),
    venue: isRequired('Venue'),
    date: isRequired('Date')
})

interface DetailsParams {
    id: string
}

export const ActivityForm: React.FC<RouteComponentProps<DetailsParams>> = observer(({ match, history }) => {
    const root = useContext(RootStoreContext);
    const { createActivity, editActivity, submitting, loadActivity } = root.activityStore;

    const [loading, setLoading] = useState(false);
    const [activity, setActivity] = useState(new ActivityFormValues());

    useEffect(() => {
        if (match.params.id) {
            setLoading(true);
            loadActivity(match.params.id)
                .then((activity) => {
                    setActivity(new ActivityFormValues(activity));
                })
                .finally(() => setLoading(false));
        }

    }, [match.params.id, loadActivity])



    const handleFinalFormSubmit = (values: any) => {
        const {date, ...activity} = values;
        activity.date = date;
        if (!activity.id) {
            let newActivity = {
                ...activity,
                id: uuid()
            }
            createActivity(newActivity)
        } else {
            editActivity(activity)
        }
    }

    return (
        <Grid>
            <Grid.Column width={10}>
                <Segment clearing>
                    <FinalForm
                        validate={validate}
                        initialValues={activity}
                        onSubmit={handleFinalFormSubmit}
                        render={({ handleSubmit, invalid, pristine }) => (
                            <Form onSubmit={handleSubmit} loading={loading}>
                                <Field placeholder='Title' name='title' value={activity.title} component={TextInput} />
                                <Field placeholder='Description' name='description' rows={3} value={activity.description} component={TextArea} />
                                <Field placeholder='Category' name='category' value={activity.category} component={SelectInput} options={category} />
                                <Field placeholder='Date' name='date' value={activity.date} component={DateInput} />
                                <Field placeholder='City' name='city' value={activity.city} component={TextInput} />
                                <Field placeholder='Venue' name='venue' value={activity.venue} component={TextInput} />
                                <Button disabled={loading || invalid || pristine} loading={submitting} floated='right' positive type='submit' content='Submit' />
                                <Button onClick={() => history.push('/activities')} floated='right' type='button' content='Cancel' />
                            </Form>
                        )}
                    />

                </Segment>
            </Grid.Column>
        </Grid>

    )
})
