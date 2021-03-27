import React from 'react';
import { Form, Label } from 'semantic-ui-react';

export const TextInput: React.FC<any> = ({ input, width, placeholder, meta: { touched, error } }) => {
    return (
        <Form.Field error={touched && !!error}>
            <input {...input} placeholder={placeholder} width={width} />
            {touched && error && (
                <Label basic color='red'>{error}</Label>
            )}
        </Form.Field>
    )
}
