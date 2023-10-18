import React, { useContext, useEffect } from "react";
import { Row, Col, Alert } from "react-bootstrap";
import Product from "../component/Product";
import { useDispatch, useSelector } from "react-redux";
import { fetchListProducts } from "../store/actions/productActions";
import Loader from "../component/Loader";
import { useLocation } from "react-router-dom";
import Paginate from "../component/Paginate";
import ProductCarousel from "../component/ProductCarousel";
import CTX from "../utils/context";
import Translation from "../utils/Translation";

const HomeScreen = () => {
    const { context } = useContext(CTX);
    const location = useLocation();
    let keyword = location.search;

    const dispatch = useDispatch();
    const productList = useSelector((state) => state.productList);
    const { products, loading, error, page, pages, perPage } = productList;

    useEffect(() => {
        dispatch(fetchListProducts(keyword));
    }, [dispatch, keyword]);

    return (
        <div>
            {!keyword && <ProductCarousel />}
            <h1>{Translation.t(context.lang, "latest_products")}</h1>
            {loading ? (
                <Loader />
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <React.Fragment>
                    <Row>
                        {products.length > 0 &&
                            products.map((product) => (
                                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                                    <Product product={product} />
                                </Col>
                            ))}
                    </Row>
                    <Paginate pages={pages} page={page} keyword={keyword} perPage={perPage} />
                </React.Fragment>
            )}
        </div>
    );
};

export default HomeScreen;
