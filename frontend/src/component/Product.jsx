import React, { useContext } from "react";
import { Card } from "react-bootstrap";
import Rating from "./Rating";
import { Link } from "react-router-dom";
import CTX from "../utils/context";
import Translation from "../utils/Translation";

const Product = ({ product }) => {
    const { context } = useContext(CTX);

    return (
        <Card className="my-3 p-3 rounded">
            <Link to={`/product/${product._id}`}>
                <Card.Img src={product.image} variant="top" height={400} />
            </Link>
            <Card.Body>
                <Link to={`/product/${product._id}`}>
                    <Card.Title as="div" className="cardTitle">
                        <strong>{product.name}</strong>
                    </Card.Title>
                </Link>

                <Card.Text as="div">
                    <div className="my-3 text-center">
                        <Rating
                            value={product.rating}
                            text={`${product.numReviews} reviews`}
                            color="#f8e825"
                        />
                    </div>
                </Card.Text>

                <Card.Text as="h3">
                    {product.price} {Translation.t(context.lang, "bgn")}
                </Card.Text>
            </Card.Body>
        </Card>
    );
};

export default Product;
