import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormContainer from "../component/FormContainer";
import { Alert, Button, Col, Form } from "react-bootstrap";
import { getUserDetails, adminUpdateUser } from "../store/actions/userActions";
import Loader from "../component/Loader";
import { userAdminActions } from "../store/reducers/userReducer";

const UserEditScreen = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const [confirmed, setConfirmed] = useState(false);

    const { userId } = useParams();

    const dispatch = useDispatch();
    const { loading, user, error } = useSelector((state) => state.userData);
    const {
        loading: loadingAdminUpdate,
        success: successAdminUpdate,
        error: errorAdminUpdate,
    } = useSelector((state) => state.usersAdmin);

    useEffect(() => {
        if (successAdminUpdate) {
            dispatch(userAdminActions.userAdminUpdateReset());
            navigate("/admin/userlist");
        } else {
            if (!user.name || user._id !== +userId) {
                dispatch(getUserDetails(userId));
            } else {
                setName(user.name);
                setEmail(user.email);
                setIsAdmin(user.isAdmin);
                setConfirmed(user.confirmed);
            }
        }
    }, [user.name, user._id, userId, successAdminUpdate]);

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(
            adminUpdateUser({
                _id: user._id,
                name,
                email,
                isAdmin,
                confirmed,
            })
        );
    };
    return (
        <div>
            <Link to={"/admin/userlist"}>Go Back</Link>
            <FormContainer>
                <h1>Edit User</h1>
                {loadingAdminUpdate && <Loader />}
                {errorAdminUpdate && <Alert variant="danger">{errorAdminUpdate}</Alert>}
                {loading ? (
                    <Loader />
                ) : error ? (
                    <Alert variant="danger">{error}</Alert>
                ) : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId="name" className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="name"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                autoComplete="new-name"
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="email" className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="new-email"
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Check
                                type="checkbox"
                                label="IsAdmin"
                                checked={isAdmin}
                                onChange={(e) => setIsAdmin(e.target.checked)}
                            ></Form.Check>
                        </Form.Group>

                        <Form.Group controlId="password" className="mb-3">
                            <Form.Check
                                type="checkbox"
                                label="Confirmed"
                                checked={confirmed}
                                onChange={(e) => setConfirmed(e.target.checked)}
                            ></Form.Check>
                        </Form.Group>

                        <Col align="center">
                            <Button type="submit" variant="primary">
                                Update
                            </Button>
                        </Col>
                    </Form>
                )}
            </FormContainer>
        </div>
    );
};

export default UserEditScreen;
