import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Button, Container, Menu, Image, Dropdown, DropdownMenu } from 'semantic-ui-react';
import { RootStoreContext } from '../../app/stores/rootStore';


const Navbar: React.FC = () => {
    const rootStore = useContext(RootStoreContext);
    const { user, logout } = rootStore.userStore;
    return (
        <Menu fixed='top' inverted>
            <Container>
                <Menu.Item header as={NavLink} to='/' exact>
                    Reactivities
                </Menu.Item>
                <Menu.Item name="Activities" as={NavLink} to='/activities' exact/>
                <Menu.Item header as={NavLink} to='/createActivity' exact>
                    <Button positive content="Create Activity" />
                </Menu.Item>
                {user && (
                    <Menu.Item position='right'>
                        <Image avatar spaced='right' src={user.image || `/assets/user-placeholder.png`}/>
                        <Dropdown pointing='top left' text={user.displayName}>
                            <DropdownMenu>
                                <Dropdown.Item as={Link} to={`/profile/${user.username}`} text='My profile' icon='user'/>
                                <Dropdown.Item onClick={logout} text='Logout' icon='power'/>
                            </DropdownMenu>
                        </Dropdown>
                    </Menu.Item>
                )}
            </Container>
        </Menu>
    )
}

export default observer(Navbar);