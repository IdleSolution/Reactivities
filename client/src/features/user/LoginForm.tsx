import { FORM_ERROR } from 'final-form';
import React, { useContext } from 'react'
import { Field, Form as FinalForm } from 'react-final-form';
import { combineValidators, isRequired } from 'revalidate';
import { Button, Form, Header } from 'semantic-ui-react';
import { ErrorMessage } from '../../app/common/form/ErrorMessage';
import { TextInput } from '../../app/common/form/TextInput';
import { RootStoreContext } from '../../app/stores/rootStore';
import { IUserFormValues } from '../../modules/user';

const validate = combineValidators({
    email: isRequired('email'),
    password: isRequired('password')
})

export const LoginForm = () => {
    const rootStore = useContext(RootStoreContext);
    const { login } = rootStore.userStore;

    return (
        <FinalForm 
            onSubmit={(values: IUserFormValues) => login(values).catch(error => ({
                [FORM_ERROR]: error
            }))}
            validate={validate}
            render={({ handleSubmit, submitting, submitError, invalid, pristine, dirtySinceLastSubmit }) => (
                <Form onSubmit={handleSubmit} error>
                    <Header as='h2' content='Login to Reactivities' color='teal' textAlign='center'/>
                    <Field name='email' component={TextInput} placeholder='Email' />
                    <Field type='password' name='password' component={TextInput} placeholder='Password' />
                    {submitError && !dirtySinceLastSubmit && (
                        <ErrorMessage error={submitError} text='Invalid email or password'/>
                    )}
                    <Button disabled={(invalid && !dirtySinceLastSubmit) || pristine} loading={submitting} color='teal' content='Login' fluid/>
                </Form>
            )}
        />

    )
}
