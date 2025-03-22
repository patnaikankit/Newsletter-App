import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/authContext"
import { ThemeProvider } from "./contexts/themeContext"
import ProtectedRoute from "./routes/protectedRoutes"
import Navbar from "./layout/navbar"
import Footer from "./layout/footer"

// Pages
import Home from "./pages/home"
import About from "./pages/about"
import Login from "./pages/auth/login"
import Signup from "./pages/auth/signup"
import ForgotPassword from "./pages/auth/forgot-password"
import CreateNewsletter from "./pages/newsletter/create"
import NewsletterDetails from "./pages/newsletter/newsletterDetails"
import CreateArticle from "./pages/article/create"
import ArticleDetails from "./pages/article/articleDetails"
import Subscribe from "./pages/article/subscribe"

function App() {
  return (
    <Router>
      <ThemeProvider>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />

                {/* Auth Routes */}
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/signup" element={<Signup />} />
                <Route path="/auth/forgot-password" element={<ForgotPassword />} />

                {/* Protected Routes */}
                <Route
                  path="/newsletter/create"
                  element={
                    <ProtectedRoute>
                      <CreateNewsletter />
                    </ProtectedRoute>
                  }
                />
                <Route path="/newsletter/:newsletterId" element={<NewsletterDetails />} />

                <Route
                  path="/article/create"
                  element={
                    <ProtectedRoute>
                      <CreateArticle />
                    </ProtectedRoute>
                  }
                />
                <Route path="/article/:articleId" element={<ArticleDetails />} />
                <Route path="/article/subscribe" element={<Subscribe />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App

