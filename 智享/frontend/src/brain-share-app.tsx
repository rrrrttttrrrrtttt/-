"use client"

import { useState } from "react"
import { Bell, Home, MessageCircle, Search, BarChart2, PlusCircle, ArrowLeft, Sun, Moon, Coffee } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Button } from "@/src/components/ui/button"

import HomePage from "./home-page"
import CreateContentPage from "./create-content-page"
import ProfilePage from "./profile-page"
import NotificationSystem from "./notification-system"
import Messaging from "./messaging"
import CreatorAnalytics from "./creator-analytics"
import SearchPage from "./search-page"
import ViewContentPage from "./view-content-page"
import ReviewRating from "./review-rating"
import RecommendationEngine from "./recommendation-engine"
import PurchaseFinancePage from "./purchase-finance-page"
import RefundPage from "./refund-page"
import RefundManagement from "./refund-management"
import PurchaseManagementPage from "./purchase-management-page"
import UserSettingsPage from "./user-settings-page"
import { AuthPages } from "./auth-pages"

export default function BrainShareApp() {
  const [currentPage, setCurrentPage] = useState("home")
  const [contentId, setContentId] = useState("")
  const [currentChatUser, setCurrentChatUser] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [pageHistory, setPageHistory] = useState<string[]>(["home"])

  const handleViewContent = (id: string) => {
    setContentId(id)
    navigateTo("viewContent")
  }

  const handlePurchase = () => {
    navigateTo("purchase")
  }

  const handleNavigate = (page: string, params?: any) => {
    if (page === "messaging" && params?.userId) {
      setContentId(params.userId)
      setCurrentChatUser(params.userName)
    } else if (page === "messaging") {
      setContentId("")
      setCurrentChatUser("")
    }
    navigateTo(page)
  }

  // 更新 handleLogin 函数，使其返回 Promise<boolean>
  const handleLogin = async (identifier: string, credential: string): Promise<boolean> => {
    // 在实际应用中，这里会验证用户凭据
    console.log("登录:", identifier, credential)

    // 模拟登录验证
    // 在实际应用中，这里会调用API验证用户凭据
    const isValidCredential = Math.random() > 0.3 // 70% 的概率登录成功，用于演示锁定机制

    if (isValidCredential) {
      setIsAuthenticated(true)
      navigateTo("home")
      return true
    }

    return false
  }

  // 更新 handleRegister 函数，添加密码参数
  const handleRegister = (identifier: string, password?: string) => {
    // 在实际应用中，这里会创建新用户
    console.log("注册:", identifier, password ? "使用密码" : "使用验证码")
    setIsAuthenticated(true)
    navigateTo("home")
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setCurrentPage("home")
    setPageHistory(["home"])
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const navigateTo = (page: string) => {
    setPageHistory((prev) => [...prev, page])
    setCurrentPage(page)
  }

  const goBack = () => {
    if (pageHistory.length > 1) {
      const newHistory = [...pageHistory]
      newHistory.pop()
      const previousPage = newHistory[newHistory.length - 1]
      setPageHistory(newHistory)
      setCurrentPage(previousPage)
    }
  }

  const pages = [
    { id: "home", name: "首页", icon: Home },
    { id: "search", name: "搜索", icon: Search },
    { id: "create", name: "创建", icon: PlusCircle },
    { id: "analytics", name: "分析", icon: BarChart2 },
    { id: "messaging", name: "消息", icon: MessageCircle },
  ]

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onViewContent={handleViewContent} onNavigate={handleNavigate} />
      case "search":
        return <SearchPage onViewContent={handleViewContent} onNavigate={handleNavigate} />
      case "create":
        return <CreateContentPage />
      case "profile":
        return <ProfilePage onNavigate={handleNavigate} />
      case "notifications":
        return <NotificationSystem />
      case "messaging":
        return <Messaging userId={contentId} userName={currentChatUser} onNavigate={handleNavigate} />
      case "analytics":
        return <CreatorAnalytics onNavigate={handleNavigate} />
      case "reviews":
        return <ReviewRating />
      case "recommendations":
        return <RecommendationEngine onViewContent={handleViewContent} />
      case "viewContent":
        return <ViewContentPage contentId={contentId} onPurchase={handlePurchase} onNavigate={handleNavigate} />
      case "purchase":
        return <PurchaseFinancePage onNavigate={handleNavigate} />
      case "refund":
        return <RefundPage onNavigate={handleNavigate} />
      case "refundManagement":
        return <RefundManagement />
      case "purchaseManagement":
        return <PurchaseManagementPage />
      case "settings":
        return <UserSettingsPage onNavigate={handleNavigate} />
      case "auth":
        return (
          <AuthPages
            onLogin={handleLogin}
            onRegister={handleRegister}
            onToggle={() => setIsLogin(!isLogin)}
            isLogin={isLogin}
          />
        )
      default:
        return <div>页面未找到</div>
    }
  }

  return (
    <div
      className={`flex flex-col h-screen max-w-md mx-auto bg-[#FFF8E1] text-[#5D4037] font-sans transition-colors duration-300 ${isDarkMode ? "dark" : ""}`}
    >
      {/* 头部 */}
      <header className="flex justify-between items-center p-4 bg-[#FFCCBC] rounded-b-lg shadow-md transition-colors duration-300">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={goBack}
            className="mr-2 hover:bg-[#FFAB91] text-current rounded-full transition-colors duration-200"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold flex items-center">
            <Coffee className="h-6 w-6 mr-2" />
            智享
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="hover:bg-[#FFAB91] text-current rounded-full transition-colors duration-200"
          >
            {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </Button>
          {isAuthenticated ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateTo("notifications")}
                className="hover:bg-[#FFAB91] text-current rounded-full transition-colors duration-200"
              >
                <Bell className="h-6 w-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateTo("profile")}
                className="hover:bg-[#FFAB91] rounded-full transition-colors duration-200"
              >
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="用户" />
                  <AvatarFallback>用户</AvatarFallback>
                </Avatar>
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              onClick={() => navigateTo("auth")}
              className="hover:bg-[#FFAB91] text-current rounded-full transition-colors duration-200"
            >
              登录
            </Button>
          )}
        </div>
      </header>

      {/* 主要内容 */}
      <main className="flex-1 overflow-y-auto p-6 bg-[#FFF8E1] transition-colors duration-300">{renderPage()}</main>

      {/* 底部导航 */}
      <footer className="bg-[#FFCCBC] rounded-t-lg shadow-md transition-colors duration-300">
        <div className="flex justify-around items-center p-4">
          {pages.map((page) => (
            <Button
              key={page.id}
              variant="ghost"
              size="icon"
              onClick={() => handleNavigate(page.id)}
              className="hover:bg-[#FFAB91] text-current rounded-full transition-colors duration-200 flex flex-col items-center"
            >
              <page.icon className="h-6 w-6 mb-1" />
              <span className="text-xs">{page.name}</span>
            </Button>
          ))}
        </div>
        <div className="flex justify-between items-center px-4 py-2 text-xs text-muted-foreground">
          <div className="flex items-center">
            <img src="/logo.svg" alt="智享科技" className="h-6 w-6 mr-2" />
            <span>智享科技</span>
          </div>
          <span>© 2023 智享科技. 保留所有权利.</span>
        </div>
      </footer>
    </div>
  )
}

