import React, { useContext } from 'react'
import { Form, Button } from 'semantic-ui-react'
import { TextInput } from '../../app/common/form/TextInput'
import { TextArea } from '../../app/common/form/TextArea';
import { Form as FinalForm, Field } from 'react-final-form';
import { combineValidators, isRequired } from 'revalidate';
import { IProfile, IProfileFormValues } from '../../modules/profile';
import { RootStoreContext } from '../../app/stores/rootStore';
import { observer } from 'mobx-react-lite';

const validate = combineValidators({
    displayName: isRequired('displayName'),
    bio: isRequired('bio')
})

interface IProps {
    setEditProfileMode: (editProfileMode: boolean) => void;
    profile: IProfile
}

export const ProfileEditForm: React.FC<IProps> = observer(({setEditProfileMode, profile}) => {

    const rootStore = useContext(RootStoreContext);
    const { editProfile, loading } = rootStore.profileStore;
    return (
        <FinalForm 
        initialValues={profile}
            onSubmit={(values: IProfileFormValues) => {
                editProfile(values).then(() => {
                    setEditProfileMode(false);
                })
            }} 
            validate={validate}
            render={({handleSubmit, invalid, pristine}) => (
                <Form onSubmit={handleSubmit} error>
                    <Field name='displayName' value={profile.displayName} component={TextInput} placeholder='Display Name' />
                    <Field
                        name='bio'
                        component={TextArea}
                        rows={3}
                        placeholder='Bio'
                        value={profile.bio}
                    />
                    <Button loading={loading} style={{marginTop: 10}}
                        floated='right'
                        disabled={invalid || pristine}
                        positive
                        content='Update profile'/>
                </Form>
            )}
        />

    )
})
