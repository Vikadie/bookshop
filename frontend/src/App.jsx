import { Container } from "react-bootstrap";
import { HashRouter } from "react-router-dom";
import Footer from "./component/Footer";
import Header from "./component/Header";
import { useState } from "react";
import CTX from "./utils/context";
import Router from "./router/Router";

function App() {
    const [context, setContext] = useState({
        lang: "bg",
    });

    return (
        <CTX.Provider value={{ context, setContext }}>
            <HashRouter>
                <Header />
                <main className="py-3">
                    <Container>
                        <Router />
                    </Container>
                </main>
                <Footer />
            </HashRouter>
        </CTX.Provider>
    );
}

export default App;
