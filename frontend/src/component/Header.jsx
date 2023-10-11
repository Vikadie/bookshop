import React, { useContext } from "react";
import { Badge, Button, ButtonGroup, Container, Nav, NavDropdown, Navbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
import { logout } from "../store/actions/userActions";
import SearchBox from "./SearchBox";
import Translation from "../utils/Translation";
import CTX from "../utils/context";

const Header = () => {
    const { context, setContext } = useContext(CTX);

    const dispatch = useDispatch();
    const userInfo = useSelector((state) => state.userData.userInfo);
    const cartItems = useSelector((state) => state.cart.cartItems);

    const qty = cartItems.reduce((prev, curr) => prev + +curr.qty, 0);

    const changeLang = (value) => {
        context.lang = value;
        setContext({ ...context });
    };

    const logoutHandler = () => {
        dispatch(logout());
    };
    return (
        <header>
            <Navbar
                bg="dark"
                data-bs-theme="dark"
                variant="dark"
                expand="lg"
                className="bg-body-tertiary"
                collapseOnSelect
            >
                <Container>
                    <LinkContainer to="/">
                        <Navbar.Brand>Book shop</Navbar.Brand>
                    </LinkContainer>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <SearchBox className="col-7" />
                        <Nav className="ml-auto">
                            <LinkContainer to="/cart">
                                <Nav.Link>
                                    <i className="fas fa-shopping-cart"></i>
                                    {qty > 0 ? (
                                        <Badge
                                            pill
                                            bg="light"
                                            as="span"
                                            text="danger"
                                            style={{
                                                position: "relative",
                                                top: "-9px",
                                                left: "-3px",
                                                padding: "0.1rem 0.25rem",
                                            }}
                                        >
                                            {qty}
                                        </Badge>
                                    ) : null}
                                    Cart
                                </Nav.Link>
                            </LinkContainer>
                            {userInfo ? (
                                <NavDropdown title={userInfo.name} id="username">
                                    <LinkContainer to="/profile">
                                        <NavDropdown.Item>Profile</NavDropdown.Item>
                                    </LinkContainer>

                                    <LinkContainer to="/">
                                        <NavDropdown.Item onClick={logoutHandler}>Logout</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                            ) : (
                                <LinkContainer to="/login">
                                    <Nav.Link>
                                        <i className="fas fa-user"></i> Login
                                    </Nav.Link>
                                </LinkContainer>
                            )}

                            {userInfo && userInfo.isAdmin && (
                                <NavDropdown title="Admin" id="adminmenu">
                                    <LinkContainer to="/admin/userlist/">
                                        <NavDropdown.Item>Users</NavDropdown.Item>
                                    </LinkContainer>

                                    <LinkContainer to="/admin/productlist/">
                                        <NavDropdown.Item>Products</NavDropdown.Item>
                                    </LinkContainer>

                                    <LinkContainer to="/admin/orderlist/">
                                        <NavDropdown.Item>Orders</NavDropdown.Item>
                                    </LinkContainer>
                                </NavDropdown>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                    <ButtonGroup variant="dark" size="sm" aria-label="outlined dark button group">
                        {Translation.getLangs()
                            .filter((x) => x.id !== context.lang)
                            .map((x) => (
                                <Button key={x.id} onClick={() => changeLang(x.id)}>
                                    {x.id}
                                </Button>
                            ))}
                    </ButtonGroup>
                </Container>
            </Navbar>
        </header>
    );
};

export default Header;
