import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "../Header/Header";


export default function App() {
    return <>

        <BrowserRouter>
            <Header />

            <Routes>
                <Route path="/" element={<h1>메인</h1>} />
            </Routes>

            {/* footer */}
        </BrowserRouter>


    </>;
}