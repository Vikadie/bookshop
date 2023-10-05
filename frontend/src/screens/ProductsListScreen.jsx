import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../component/Loader";
import { LinkContainer } from "react-router-bootstrap";
import { Alert, Button, Table, Row, Col } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { deleteProduct, fetchListProducts, createProduct } from "../store/actions/productActions";
import { productCreateOrDeleteActions } from "../store/reducers/productReducers";
import Paginate from "../component/Paginate";

const ProductListScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const productList = useSelector((state) => state.productList);
    const { loading, error, products, page, pages, perPage } = productList;
    const userInfo = useSelector((state) => state.userData.userInfo);

    const {
        loading: loadingDelete,
        error: errorDelete,
        success: successDelete,
        successCreate,
        product: createdProduct,
    } = useSelector((state) => state.productCreateOrDelete);

    let keyword = location.search;
    console.log(userInfo);
    useEffect(() => {
        dispatch(productCreateOrDeleteActions.productCreateReset());

        if (!userInfo || !userInfo.isAdmin) {
            navigate("/login");
        }

        if (successCreate) {
            navigate(`/admin/product/${createdProduct._id}/edit`);
        } else {
            dispatch(fetchListProducts(keyword));
        }
    }, [dispatch, successCreate, userInfo, successDelete, keyword]);

    const createProductHandler = () => {
        // create product
        dispatch(createProduct());
    };

    const deleteHandler = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            dispatch(deleteProduct(id));
        }
    };

    return (
        <div>
            <Row className="align-items-center">
                <Col>
                    <h1>Products</h1>
                </Col>
                <Col className="text-right">
                    <Button className="my-3" onClick={createProductHandler}>
                        <i className="fas fa-plus"></i>Create Product
                    </Button>
                </Col>
            </Row>
            {loadingDelete ? <Loader /> : errorDelete ? <Alert variant="danger">{errorDelete}</Alert> : null}
            {loading ? (
                <Loader />
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <React.Fragment>
                    <Table striped bordered hover responsive className="table-sm">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Brand</th>
                                <th>Stock</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product._id}>
                                    <td>{product._id}</td>
                                    <td>{product.name}</td>
                                    <td>{product.price} BGN</td>
                                    <td>{product.category}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.countInStock}</td>
                                    <td>
                                        <LinkContainer to={`/admin/product/${product._id}/edit`}>
                                            <Button type="button" variant="light" className="btn-sm">
                                                <i className="fas fa-edit"></i>
                                            </Button>
                                        </LinkContainer>
                                        <Button
                                            type="button"
                                            variant="danger"
                                            className="btn-sm"
                                            onClick={() => deleteHandler(product._id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                    <Paginate pages={pages} page={page} isAdmin={true} perPage={perPage} />
                </React.Fragment>
            )}
        </div>
    );
};

export default ProductListScreen;
