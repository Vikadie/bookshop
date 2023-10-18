import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Alert, Button, Col, Image, ListGroup, Row, Form } from "react-bootstrap";
import Rating from "../component/Rating";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetails, createProductReview } from "../store/actions/productDetailActions";
import { productCreateReviewActions } from "../store/reducers/productDetailReducer";
import Loader from "../component/Loader";
import CTX from "../utils/context";
import Translation from "../utils/Translation";

const ProductScreen = () => {
    const { context } = useContext(CTX);
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
                {Translation.t(context.lang, "go_back")}
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
                                        text={`${product.numReviews} ${
                                            product.numReviews > 1
                                                ? Translation.t(context.lang, "r_eviews")
                                                : Translation.t(context.lang, "r_eview")
                                        }`}
                                        color="#f8e825"
                                    />
                                </ListGroup.Item>

                                <ListGroup.Item>
                                    {Translation.t(context.lang, "price")}: {product.price}{" "}
                                    {Translation.t(context.lang, "bgn")}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    {Translation.t(context.lang, "descr")}: {product.description}
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                        <Col md={3}>
                            <ListGroup variant="flush">
                                <ListGroup.Item>
                                    <Row>
                                        <Col>{Translation.t(context.lang, "price")}:</Col>
                                        <Col>
                                            <strong>
                                                {product.price} {Translation.t(context.lang, "bgn")}
                                            </strong>
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <Row>
                                        <Col>{Translation.t(context.lang, "status")}:</Col>
                                        <Col>
                                            {product.countInStock > 0
                                                ? Translation.t(context.lang, "in_stock")
                                                : Translation.t(context.lang, "oos")}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                                {product.countInStock > 0 && (
                                    <ListGroup.Item>
                                        <Row>
                                            <Col>{Translation.t(context.lang, "qty")}</Col>
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
                                        {Translation.t(context.lang, "add_to_cart")}
                                    </Button>
                                </ListGroup.Item>
                            </ListGroup>
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col md={6}>
                            <h4>{Translation.t(context.lang, "reviews")}</h4>
                            {product.reviews.length === 0 && (
                                <Alert variant="info">{Translation.t(context.lang, "no_reviews")}</Alert>
                            )}

                            <ListGroup variant="flush">
                                {product.reviews.map((review) => (
                                    <ListGroup.Item key={review._id}>
                                        <strong>{review.name}</strong>
                                        <Rating value={review.rating} color="#f8e825" />
                                        <p>
                                            {new Date(review.createdAt).toLocaleDateString(
                                                context.lang === "bg" ? "bg-BG" : "en-us",
                                                {
                                                    // weekday: "long",
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                }
                                            )}
                                        </p>
                                        <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))}

                                <ListGroup.Item>
                                    <h4>{Translation.t(context.lang, "write_review")}:</h4>
                                    {loadingProductReview && <Loader />}
                                    {successProductReview && (
                                        <Alert variant="success">
                                            {Translation.t(context.lang, "submitted_review")}
                                        </Alert>
                                    )}
                                    {errorProductReview && (
                                        <Alert variant="danger">{errorProductReview}</Alert>
                                    )}
                                    {userInfo ? (
                                        <Form onSubmit={submitHandler}>
                                            <Form.Group controlId="rating">
                                                <Form.Label>
                                                    {Translation.t(context.lang, "rating")}
                                                </Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    value={rating}
                                                    onChange={(e) => setRating(e.target.value)}
                                                >
                                                    <option value="">
                                                        {Translation.t(context.lang, "selecting")}
                                                    </option>
                                                    <option value="1">
                                                        {Translation.t(context.lang, "note_1")}
                                                    </option>
                                                    <option value="2">
                                                        {Translation.t(context.lang, "note_2")}
                                                    </option>
                                                    <option value="3">
                                                        {Translation.t(context.lang, "note_3")}
                                                    </option>
                                                    <option value="4">
                                                        {Translation.t(context.lang, "note_4")}
                                                    </option>
                                                    <option value="5">
                                                        {Translation.t(context.lang, "note_5")}
                                                    </option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId="comment">
                                                <Form.Label>
                                                    {Translation.t(context.lang, "review")}
                                                </Form.Label>
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
                                                {Translation.t(context.lang, "submit")}
                                            </Button>
                                        </Form>
                                    ) : (
                                        <Alert variant="info">
                                            {Translation.t(context.lang, "please")}{" "}
                                            <Link to="/login">{Translation.t(context.lang, "log_in")}</Link>{" "}
                                            {Translation.t(context.lang, "to_write_review")}
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
