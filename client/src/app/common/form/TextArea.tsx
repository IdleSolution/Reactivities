import React from 'react'
import { Form, Label } from 'semantic-ui-react';

export const TextArea: React.FC<any> = ({ input, width, rows, placeholder, meta: { touched, error } }) => {
    return (
        <Form.Field error={touched && !!error}>
            <textarea rows={rows} {...input} placeholder={placeholder} width={width}/>
            {touched && error && (
                <Label basic color='red'>{error}</Label>
            )}
        </Form.Field>
    )
}
