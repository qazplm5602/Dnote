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
import Post from "../Post/Post";
import Search from "../Search/Search";
import { Provider } from "react-redux";
import { store } from "../Redux/Store";
import LoginState from "../LoginState/LoginState";
import LoginSuccess from "../Login/Process/LoginSuccess";
import Logout from "../Login/Process/Logout";
import NotifyContext from "../Notify/NotifyContext";
import ContextMenu from "../ContextMenu/ContextMenu";
import UserContents from "../UserContents/UserContents";
import { useEffect, useRef } from "react";
import PostPopular from "../PostPopular/PostPopular";
import { HelmetProvider } from "react-helmet-async";
import NotFoundPage from "../ErrorPage/NotFound/NotFound";

export default function App() {
    
    return <BrowserRouter>
        <Provider store={store}>
            <NotifyContext>
                <HelmetProvider>
                
                    <LoginState />
                    <ContextMenu />
                    <Header />
                    <AppRouter />

                </HelmetProvider>
            </NotifyContext>
        </Provider>
    </BrowserRouter>;
}

function AppRouter() {
    const location = useLocation();
    const scrollYRef = useRef(0);

    const onExit = function(element: HTMLElement) {
        if (element)
            element.style.top = `calc(-${scrollYRef.current}px + var(--header-height))`;
    }

    useEffect(() => {
        const onScroll = function() {
            scrollYRef.current = window.scrollY;
        }

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return <TransitionGroup >
        <CSSTransition key={location.pathname} onExit={onExit} classNames={{
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
                <Route path="/login/success" element={<LoginSuccess />} />
                <Route path="/logout" element={<Logout />} />
                <Route path="/signup" element={<SignUp />} />
                <Route path="/user/:id" element={<UserPage />} />
                <Route path="/user/:id/content" element={<UserContents />} />
                <Route path="/setting/*" element={<Setting />} />
                <Route path="/write" element={<Write />} />
                <Route path="/post/:user/:id" element={<Post />} />
                <Route path="/post/popular" element={<PostPopular />} />
                <Route path="/search" element={<Search />} />
                <Route path="*" element={<NotFoundPage />} />

            </Routes>
        </CSSTransition>
    </TransitionGroup>;
}