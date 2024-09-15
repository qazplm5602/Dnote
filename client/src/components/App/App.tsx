import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "../Header/Header";
import Home from "../Home/Home";


export default function App() {
    return <>

        <BrowserRouter>
            <Header />

            <Routes>
                <Route path="/" element={<Home />} />
            </Routes>

            {/* footer */}
        </BrowserRouter>


    </>;
}