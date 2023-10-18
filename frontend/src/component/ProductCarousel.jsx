import React, { useContext, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Alert, Carousel, Image } from "react-bootstrap";
import { topProductsList } from "../store/actions/productActions";
import Loader from "./Loader";
import CTX from "../utils/context";
import Translation from "../utils/Translation";

const ProductCarousel = () => {
    const { context } = useContext(CTX);
    const dispatch = useDispatch();

    const productTopRated = useSelector((state) => state.productTopRated);
    const { loading, error, topProducts } = productTopRated;

    useEffect(() => {
        dispatch(topProductsList());
    }, [dispatch]);
    return loading ? (
        <Loader />
    ) : error ? (
        <Alert variant="danger">{error}</Alert>
    ) : (
        <Carousel pause="hover" className="bg-dark" data-bs-theme="dark">
            {topProducts.map((pr) => (
                <Carousel.Item key={pr._id}>
                    <Link to={`/product/${pr._id}`}>
                        <Image src={pr.image} alt={pr.name} fluid />
                        <Carousel.Caption className="carousel.caption">
                            <h4>
                                {pr.name} ({pr.price} {Translation.t(context.lang, "bgn")})
                            </h4>
                        </Carousel.Caption>
                    </Link>
                </Carousel.Item>
            ))}
        </Carousel>
    );
};

export default ProductCarousel;
