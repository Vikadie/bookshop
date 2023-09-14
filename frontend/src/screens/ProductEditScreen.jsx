import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import FormContainer from "../component/FormContainer";
import { Alert, Button, Col, Form } from "react-bootstrap";
import { fetchProductDetails } from "../store/actions/productDetailActions";
import Loader from "../component/Loader";
import { updateProduct } from "../store/actions/productActions";
import { productCreateOrDeleteActions } from "../store/reducers/productReducers";

const ProductEditScreen = () => {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [image, setImage] = useState("");
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [countInStock, setCountInStock] = useState(0);
    const [description, setDescription] = useState("");
    const [uploading, setUploading] = useState(false);

    const { productId } = useParams();

    const dispatch = useDispatch();
    const { loading, product, error } = useSelector((state) => state.productDetail);
    const {
        loading: loadingUpdate,
        successCreate: successUpdate,
        error: errorUpdate,
    } = useSelector((state) => state.productCreateOrDelete);

    useEffect(() => {
        if (successUpdate) {
            dispatch(productCreateOrDeleteActions.productCreateReset());
            navigate(`/admin/productlist`);
        } else {
            if (!product.name || product._id !== +productId) {
                dispatch(fetchProductDetails(productId));
            } else {
                setName(product.name);
                setPrice(product.price);
                setImage(product.image);
                setBrand(product.brand);
                setCategory(product.category);
                setCountInStock(product.countInStock);
                setDescription(product.description);
            }
        }
    }, [dispatch, product._id, product.name, productId, successUpdate]);

    const submitHandler = (e) => {
        e.preventDefault();

        // update product
        dispatch(
            updateProduct({
                _id: productId,
                name,
                price,
                image,
                brand,
                category,
                countInStock,
                description,
            })
        );
    };

    const userInfo = useSelector((state) => state.userData.userInfo);

    const uploadFileHandler = (e) => {
        setUploading(true);

        const upload = async () => {
            const file = e.target.files[0];
            const formData = new FormData();

            formData.append("image", file);
            formData.append("product_id", productId);

            const config = {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${userInfo.token}`,
                },
            };
            const { data } = await axios.post(`/api/products/upload/`, formData, config);

            setImage(data);
            setUploading(false);
        };

        try {
            upload();
        } catch (error) {
            setUploading(false);
        }
    };

    return (
        <div>
            <Link to={"/admin/productlist"}>Go Back</Link>
            <FormContainer>
                <h1>Edit Product</h1>

                {loadingUpdate && <Loader />}
                {errorUpdate && <Alert variant="danger">{errorUpdate}</Alert>}

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

                        <Form.Group controlId="price" className="mb-3">
                            <Form.Label>Price</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter price"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                autoComplete="new-price"
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="image" className="mb-3">
                            <Form.Label>Image</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter image"
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                                autoComplete="new-image"
                            ></Form.Control>
                            <Form.Control
                                name="image-file"
                                type="file"
                                onChange={uploadFileHandler}
                            ></Form.Control>

                            {uploading && <Loader />}
                        </Form.Group>

                        <Form.Group controlId="brand" className="mb-3">
                            <Form.Label>Brand</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter brand"
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                                autoComplete="new-brand"
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="countinstock" className="mb-3">
                            <Form.Label>Stock</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter stock"
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                                autoComplete="new-stock"
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="category" className="mb-3">
                            <Form.Label>Category</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter category"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                autoComplete="new-category"
                            ></Form.Control>
                        </Form.Group>

                        <Form.Group controlId="description" className="mb-3">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                autoComplete="new-descrition"
                            ></Form.Control>
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

export default ProductEditScreen;
