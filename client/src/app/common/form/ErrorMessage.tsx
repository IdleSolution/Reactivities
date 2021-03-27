import { AxiosResponse } from 'axios';
import React from 'react';
import { Message } from 'semantic-ui-react';

interface IProps {
    error: AxiosResponse,
    text?: string
}

export const ErrorMessage: React.FC<IProps> = ({error, text}) => {
    console.log(error);
    return (
        <Message error>
            <Message.Header>
                {error.statusText}
            </Message.Header>
            <Message.List>
                {error.data !== "" && Object.values(error.data.errors).flat().map((err: any, i) => (
                    <Message.Item key={i}>{err}</Message.Item>
                ))}
            </Message.List>
            {text && <Message.Content content={text} />}
        </Message>
    )
}
