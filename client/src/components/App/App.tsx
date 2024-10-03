import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import Header from "../Header/Header";
import Home from "../Home/Home";
import Footer from "../Footer/Footer";

import style from './app.module.css';
import Login from "../Login/Login";
import LoginHelp from "../Login/Help/LoginHelp";
import LoginPasswordForget from "../Login/PasswordForget/LoginPasswordForget";
import SignUp from "../SignUp/SignUp";
import UserPage from "../UserPage/UserPage";
import Setting from "../Setting/Setting";
import Write from "../Write/Write";

export default function App() {
    
    return <BrowserRouter>
        <Header />
        <AppRouter />
    </BrowserRouter>;
}

function AppRouter() {
    const location = useLocation();

    return <TransitionGroup >
        <CSSTransition key={location.pathname} classNames={{
            enter: style.enter,
            enterActive: style.enter_active,
            exit: style.exit,
            exitActive: style.exit_active,
        }} timeout={300}>
            <Routes location={location}>

                <Route path="/" element={<Home />} />
                <Route path="/test" element={<><h2>안녕.</h2><Footer /></>} />
                <Route path="/login" element={<Login />} />
                <Route path="/login/help" element={<LoginHelp />} />
                <Route path="/login/help/forget" element={<LoginPasswordForget />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/user/:id" element={<UserPage />} />
                <Route path="/setting/*" element={<Setting />} />
                <Route path="/write" element={<Write />} />

            </Routes>
        </CSSTransition>
    </TransitionGroup>;
}