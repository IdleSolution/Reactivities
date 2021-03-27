import React, { Fragment, useContext } from 'react'
import { Link } from 'react-router-dom'
import { Button, Container, Header, Segment } from 'semantic-ui-react'
import { RootStoreContext } from '../../app/stores/rootStore'
import { LoginForm } from '../user/LoginForm'
import { RegisterForm } from '../user/RegisterForm'

export const HomePage = () => {
    const token = window.localStorage.getItem('jwt');
    const rootStore = useContext(RootStoreContext);
    const { isLoggedIn, user } = rootStore.userStore;
    const { openModal } = rootStore.modalStore;
    return (
        <Segment inverted textAlign='center' vertical className='masthead'>
            <Container text>
                <Header as='h1'>
                    Reactivites
                </Header>
                {isLoggedIn && user && token ? (
                    <Fragment>
                        <Header as='h2' inverted content={`Welcome back, ${user.username}!`} />
                        <Button as={Link} to='/activities'>Go to activities!</Button>
                    </Fragment>
                ) : (
                    <Fragment>
                        <Header as='h2' inverted content='Welcome to Reactivites' />
                        <Button onClick={() => openModal(<LoginForm />)}>Login</Button>
                        <Button onClick={() => openModal(<RegisterForm />)}>Register</Button>
                    </Fragment>
                )}
            </Container>
        </Segment>

    )
}
