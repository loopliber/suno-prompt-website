import Layout from "./Layout.jsx";

import Homepage from "./Homepage";

import Blog from "./Blog";

import Guide from "./Guide";
import GuideArticle from "./GuideArticle.jsx";

import Generator from "./Generator";

import BlogArticle from "./BlogArticle.jsx";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Homepage: Homepage,
    
    Blog: Blog,
    
    Guide: Guide,
    
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
                
                    <Route path="/" element={<Homepage />} />
                
                
                <Route path="/Homepage" element={<Homepage />} />
                
                <Route path="/Blog" element={<Blog />} />
                
                {/** Canonical lowercase routes */}
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogArticle />} />
                <Route path="/guide" element={<Guide />} />
                <Route path="/guide/:slug" element={<GuideArticle />} />
                {/** Backwards compatibility for existing uppercase links */}
                <Route path="/Guide" element={<Guide />} />
                
                <Route path="/Generator" element={<Generator />} />
                
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