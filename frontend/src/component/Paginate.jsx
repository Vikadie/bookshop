import React, { useContext } from "react";
import { Col, FormControl, Pagination, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CTX from "../utils/context";
import Translation from "../utils/Translation";

const Paginate = ({ pages, page, perPage, keyword = "", isAdmin = false }) => {
    const { context } = useContext(CTX);
    const navigate = useNavigate();

    if (keyword) {
        // keyword comes in the form of "?keyword=...&page=..."
        keyword = keyword.split("&")[0];
    }

    const goToPage = (pageNumber) => {
        navigate({
            pathname: `${!isAdmin ? "/" : "/admin/productlist/"}`,
            search: `${keyword}&page=${pageNumber}&perPage=${perPage}`,
        });
    };

    const changePerPage = (perPageNumber) => {
        navigate({
            pathname: `${!isAdmin ? "/" : "/admin/productlist/"}`,
            search: `${keyword}&page=${page}&perPage=${perPageNumber}`,
        });
    };

    return (
        <Row>
            <Col xs={12} sm={8} lg={10}>
                {pages > 1 && (
                    <Pagination>
                        <Pagination.First onClick={() => goToPage(1)} />
                        <Pagination.Prev onClick={() => goToPage(page - 1)} />
                        {[...Array(pages).keys()].map((p) => (
                            <Pagination.Item
                                key={p + 1}
                                active={p + 1 === page}
                                onClick={() => goToPage(p + 1)}
                            >
                                {p + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next onClick={() => goToPage(page + 1)} />
                        <Pagination.Last onClick={() => goToPage(pages)} />
                    </Pagination>
                )}
            </Col>
            <Col xs={12} sm={4} lg={2}>
                <FormControl
                    size="sm"
                    as="select"
                    value={perPage}
                    onChange={(e) => changePerPage(e.target.value)}
                >
                    {[4, 5, 10, 20, 100].map((x) => (
                        <option key={x} value={x}>
                            {Translation.t(context.lang, "show")} {x}{" "}
                            {Translation.t(context.lang, "per_page")}
                        </option>
                    ))}
                </FormControl>
            </Col>
        </Row>
    );
};

export default Paginate;
