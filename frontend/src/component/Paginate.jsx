import React from "react";
import { Pagination } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Paginate = ({ pages, page, keyword = "", isAdmin = false }) => {
    const navigate = useNavigate();

    if (keyword) {
        // keyword comes in the form of "?keyword=...&page=..."
        keyword = keyword.split("&")[0];
    }

    const goToPage = (pageNumber) => {
        navigate({
            pathname: `${!isAdmin ? "/" : "/admin/productlist/"}`,
            search: `${keyword}&page=${pageNumber}`,
        });
    };

    return (
        pages > 1 && (
            <Pagination>
                <Pagination.First onClick={() => goToPage(1)} />
                <Pagination.Prev onClick={() => goToPage(page - 1)} />
                {[...Array(pages).keys()].map((p) => (
                    <Pagination.Item key={p + 1} active={p + 1 === page} onClick={() => goToPage(p + 1)}>
                        {p + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => goToPage(page + 1)} />
                <Pagination.Last onClick={() => goToPage(pages)} />
            </Pagination>
        )
    );
};

export default Paginate;
