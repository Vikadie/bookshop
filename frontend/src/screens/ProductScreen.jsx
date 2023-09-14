import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Col, Image, ListGroup, Row, Form } from "react-bootstrap";
import Rating from "../component/Rating";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails, createProductReview } from "../store/actions/productDetailActions";
import { productCreateReviewActions } from "../store/reducers/productDetailReducer";
import Loader from "../component/Loader";
import axios from "axios";

const ProductScreen = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { userInfo } = useSelector((state) => state.userData);
    const { product, loading, error } = useSelector((state) => state.productDetail);
    const { successProductReview, loadingProductReview, errorProductReview } = useSelector(
        (state) => state.productCreateReview
    );

    const { id } = useParams();
    const [qty, setQty] = useState(1);

    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");

    useEffect(() => {
        if (successProductReview) {
            setRating(0);
            setComment("");
            dispatch(productCreateReviewActions.productCreateReviewReset());
        }
        dispatch(fetchProductDetails(id));
    }, [id, dispatch, successProductReview]);

    const addToCartHandler = () => {
        navigate(`/cart/${id}?${qty}`);
    };

    const submitHandler = (e) => {
        e.preventDefault();

        dispatch(createProductReview(id, { rating, comment }));
    };

    return (
        <div>
            <Link to="/" className="btn btn-dark my-3">
                Go Back
            </Link>
            {loading ? (
                <Loader />
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <React.Fragment>
                    <Row>
                        <Col md={6}>
                            <Image src={product.image} alt={product.name} fluid />
                        </Col>
                        <Col md={3}>
                            <ListGroup variant={"flush"}>
                                <ListGroup.Item>
                                    <h3>{product.name}</h3>
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    <Rating
                                        value={product.rating}
                                        text={`${product.numReviews} reviews`}
                                        color="#f8e825"
                                    />
                                </ListGroup.Item>

                                <ListGroup.Item>Price: {product.price} BGN</ListGroup.Item>
                                <ListGroup.Item>Description: {product.description}</ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Price:</Col>
                                        <Col>
                                            <strong>{product.price} BGN</strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>Status:</Col>
                                        <Col>{product.countInStock > 0 ? "In stock" : "Out of stock"}</Col>
                                    </Row>
                                </ListGroup.Item>
                                {product.countInStock > 0 && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>Qty</Col>
                                            <Col xs="auto" className="my-1">
                                                <Form.Control
                                                    as="select"
                                                    value={qty}
                                                    onChange={(e) => setQty(e.target.value)}
                                                >
                                                    {[...Array(product.countInStock).keys()].map((x) => (
                                                        <option key={x + 1} value={x + 1}>
                                                            {x + 1}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                )}
                                <ListGroup.Item>
                                    <Button
                                        onClick={addToCartHandler}
                                        className="btn-block"
                                        type="button"
                                        style={{ width: "100%" }}
                                        disabled={product.countInStock <= 0}
                                    >
                                        Add to Card
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col md={6}>
                            <h4>Reviews</h4>
                            {product.reviews.length === 0 && <Alert variant="info">No reviews</Alert>}

                            <ListGroup variant="flush">
                                {product.reviews.map((review) => (
                                    <ListGroup.Item key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating} color="#f8e825" />
                                        <p>
                                            {new Date(review.createdAt).toLocaleDateString("en-us", {
                                                // weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))}

                                <ListGroup.Item>
                                    <h4>Write a review:</h4>
                                    {loadingProductReview && <Loader />}
                                    {successProductReview && (
                                        <Alert variant="success">Review submitted</Alert>
                                    )}
                                    {errorProductReview && (
                                        <Alert variant="danger">{errorProductReview}</Alert>
                                    )}
                                    {userInfo ? (
                                        <Form onSubmit={submitHandler}>
                                            <Form.Group controlId="rating">
                                                <Form.Label>Rating</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    value={rating}
                                                    onChange={(e) => setRating(e.target.value)}
                                                >
                                                    <option value="">Select...</option>
                                                    <option value="1">1 - Poor</option>
                                                    <option value="2">2 - Fair</option>
                                                    <option value="3">3 - Good</option>
                                                    <option value="4">4 - Very Good</option>
                                                    <option value="5">5 - Excellent</option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId="comment">
                                                <Form.Label>Review</Form.Label>
                                                <Form.Control
                                                    as="textarea"
                                                    row="5"
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                ></Form.Control>
                                            </Form.Group>
                                            <Button
                                                disabled={loadingProductReview}
                                                type="submit"
                                                variant="primary"
                                            >
                                                Submit
                                            </Button>
                                        </Form>
                                    ) : (
                                        <Alert variant="info">
                                            Please <Link to="/login">login</Link> to write a review
                                        </Alert>
                                    )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                </React.Fragment>
            )}
        </div>
    );
};

export default ProductScreen;
