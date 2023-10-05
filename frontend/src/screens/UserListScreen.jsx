import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listUsers, deleteUser } from "../store/actions/userActions";
import Loader from "../component/Loader";
import { LinkContainer } from "react-router-bootstrap";
import { Alert, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const UserListScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userList = useSelector((state) => state.usersAdmin);
    const { loading, error, users, success } = userList;
    const userInfo = useSelector((state) => state.userData.userInfo);

    useEffect(() => {
        if (userInfo && userInfo.isAdmin) {
            dispatch(listUsers());
        } else {
            navigate("/login");
        }
    }, [dispatch, userInfo, success]);

    const deleteHandler = (id) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            dispatch(deleteUser(id));
        }
    };

    return (
        <div>
            <h1>Users List</h1>
            {loading ? (
                <Loader />
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <Table striped bordered hover responsive className="table-sm">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>ADMIN</th>
                            <th>Confirmed</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>
                                    {user.isAdmin ? (
                                        <i className="fas fa-check" style={{ color: "green" }}></i>
                                    ) : (
                                        <i className="fas fa-check" style={{ color: "red" }}></i>
                                    )}
                                </td>
                                <td>
                                    {user.confirmed ? (
                                        <i className="fas fa-check" style={{ color: "green" }}></i>
                                    ) : (
                                        <i className="fas fa-check" style={{ color: "red" }}></i>
                                    )}
                                </td>
                                <td>
                                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                                        <Button type="button" variant="light" className="btn-sm">
                                            <i className="fas fa-edit"></i>
                                        </Button>
                                    </LinkContainer>
                                    <Button
                                        type="button"
                                        variant="danger"
                                        className="btn-sm"
                                        onClick={() => deleteHandler(user._id)}
                                    >
                                        <i className="fas fa-trash"></i>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default UserListScreen;
