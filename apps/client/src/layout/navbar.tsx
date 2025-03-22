"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Button } from "../ui/button"
import { useAuth } from "../hooks/useAuth"
import { useTheme } from "../hooks/useTheme"
import { Sun, Moon, Menu, X, Sparkles } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [location.pathname])

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/80 backdrop-blur-md border-b border-border shadow-sm" : "bg-background"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold flex items-center">
              <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mr-2 text-white">
                <Sparkles size={16} />
              </span>
              <span className="font-heading">Newsletter Hub</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <Link to="/" className="px-3 py-2 rounded-md hover:bg-muted transition-colors">
              Home
            </Link>
            <Link to="/article/subscribe" className="px-3 py-2 rounded-md hover:bg-muted transition-colors">
              Subscribe
            </Link>
            <Link to="/about" className="px-3 py-2 rounded-md hover:bg-muted transition-colors">
              About
            </Link>

            <div className="ml-2 border-l border-border h-6 mx-2"></div>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            {user ? (
              <div className="flex items-center space-x-4 ml-2">
                <Link to="/newsletter/create">
                  <Button variant="outline" size="sm" className="font-medium border-primary/50 hover:border-primary">
                    Create Newsletter
                  </Button>
                </Link>
                <Button onClick={handleLogout} variant="ghost" size="sm">
                  Log Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-4 ml-2">
                <Link to="/auth/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/auth/signup">
                  <Button size="sm" className="font-medium gradient-bg border-0 hover:opacity-90">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden space-x-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            >
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md hover:bg-muted transition-colors"
              aria-expanded={isMenuOpen}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-border">
          <div className="container mx-auto px-4 py-3 space-y-2">
            <Link to="/" className="block px-3 py-2 rounded-md hover:bg-muted transition-colors">
              Home
            </Link>
            <Link to="/article/subscribe" className="block px-3 py-2 rounded-md hover:bg-muted transition-colors">
              Subscribe
            </Link>
            <Link to="/about" className="block px-3 py-2 rounded-md hover:bg-muted transition-colors">
              About
            </Link>

            <div className="border-t border-border my-2"></div>

            {user ? (
              <>
                <Link to="/newsletter/create" className="block px-3 py-2 rounded-md hover:bg-muted transition-colors">
                  Create Newsletter
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors"
                >
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/auth/login" className="block px-3 py-2 rounded-md hover:bg-muted transition-colors">
                  Log In
                </Link>
                <Link
                  to="/auth/signup"
                  className="block px-3 py-2 rounded-md hover:bg-muted transition-colors font-medium text-primary"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

