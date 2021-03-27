import React from 'react'
import { Form, Label } from 'semantic-ui-react';
import { DateTimePicker } from 'react-widgets';

export const DateInput: React.FC<any> = ({ input, width, placeholder, meta: { touched, error }, ...rest }) => {
    return (
        <Form.Field error={touched && !!error}>
            <DateTimePicker 
                placeholder={placeholder}
                value={input.value || null}
                onChange={input.onChange}
                onBlur={input.onBlur}
                onKeyDown={e => e.preventDefault()}
                {...rest}
            />
            {touched && error && (
                <Label basic color='red'>{error}</Label>
            )}
        </Form.Field>
    )
}
