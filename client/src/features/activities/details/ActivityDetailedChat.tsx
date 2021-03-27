import React, { Fragment, useContext, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { Header, Segment, Comment, Form, Button } from 'semantic-ui-react'
import { RootStoreContext } from '../../../app/stores/rootStore'
import { Form as FinalForm, Field } from 'react-final-form';
import { TextArea } from '../../../app/common/form/TextArea';
import { observer } from 'mobx-react-lite';
import { formatDistance } from 'date-fns';

export const ActivityDetailedChat = observer(() => {
    const rootStore = useContext(RootStoreContext);
    const { createHubConnection, stopHubConnection, addComment, activity } = rootStore.activityStore;

    useEffect(() => {
        createHubConnection();
        return () => {
          stopHubConnection();
        }
      }, [createHubConnection, stopHubConnection])

    return (
        <Fragment>
            <Segment
                textAlign='center'
                attached='top'
                inverted
                color='teal'
                style={{ border: 'none' }}
            >
                <Header>Chat about this event</Header>
            </Segment>
            <Segment attached>
                <Comment.Group>
                    {activity && activity.comments && activity.comments.map(comment => (
                        <Comment key={comment.id}>
                            <Comment.Avatar src={comment.image || '/assets/user-placeholder.png'} />
                            <Comment.Content>
                                <Comment.Author as={Link} to={`/profile/${comment.username}`}>{comment.displayName}</Comment.Author>
                                <Comment.Metadata>
                                    <div>{formatDistance(comment.createdAt, new Date())}</div>
                                </Comment.Metadata>
                                <Comment.Text>{comment.body}</Comment.Text>
                            </Comment.Content>
                        </Comment>
                    ))}
                    <FinalForm onSubmit={addComment}
                        render={({ handleSubmit, submitting, form }) => (
                            <Form onSubmit={() => handleSubmit()!.then(() => form.reset())}>
                                <Field name='body' component={TextArea} rows={2} placeholder='Add your comment'/>
                                <Button
                                    content='Add Reply'
                                    labelPosition='left'
                                    icon='edit'
                                    primary 
                                    loading={submitting}
                                    />
                            </Form>
                        )}
                    />


                </Comment.Group>
            </Segment>
        </Fragment>
    )
})
