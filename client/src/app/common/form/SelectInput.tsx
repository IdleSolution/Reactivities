import React from 'react'
import { Form, Label, Select } from 'semantic-ui-react'

export const SelectInput: React.FC<any> = ({ input, width, options, placeholder, meta: { touched, error } }) => {
    return (
        <Form.Field error={touched && !!error}>
            <Select 
                value={input.value}
                onBlur={input.onBlur}
                onChange={(e, data) => input.onChange(data.value)}
                placeholder={placeholder}
                options={options}
            />
            {touched && error && (
                <Label basic color='red'>{error}</Label>
            )}
        </Form.Field>
    )
}
