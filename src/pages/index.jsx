import Layout from "./Layout.jsx";
import Homepage from "./Homepage";
import Blog from "./Blog";
import Generator from "./Generator";
import BlogArticle from "./BlogArticle.jsx";
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';

const PAGES = {
    Homepage: Homepage,
    Blog: Blog,
    Generator: Generator,
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                {/* Homepage - only accessible via root domain */}
                <Route path="/" element={<Homepage />} />
                
                {/* Redirect old /homepage route to root */}
                <Route path="/homepage" element={<Navigate to="/" replace />} />
                <Route path="/Homepage" element={<Navigate to="/" replace />} />
                
                {/* Blog routes */}
                <Route path="/Blog" element={<Blog />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogArticle />} />
                
                {/* Generator route */}
                <Route path="/Generator" element={<Generator />} />
                <Route path="/generator" element={<Generator />} />
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}