"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Eye, EyeOff, Check, X, AlertCircle, Lock } from "lucide-react"
import { Progress } from "@/src/components/ui/progress"
import { Alert, AlertDescription } from "@/src/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog"

interface AuthProps {
  onLogin: (identifier: string, credential: string) => Promise<boolean>
  onRegister: (identifier: string, password?: string) => void
  onToggle: () => void
  isLogin: boolean
}

// 模拟存储登录尝试的数据结构
// 在实际应用中，这应该存储在服务器端
interface LoginAttempt {
  identifier: string
  attempts: number
  lastAttempt: number
  lockedUntil: number | null
}

// 账户锁定配置
const LOCK_THRESHOLD = 5 // 5次失败尝试后锁定
const LOCK_DURATION = 15 * 60 * 1000 // 15分钟锁定时间（毫秒）
const ATTEMPT_RESET_TIME = 60 * 60 * 1000 // 1小时后重置尝试次数（毫秒）

// 密码强度检查函数
const checkPasswordStrength = (password: string): { score: number; feedback: string[] } => {
  const feedback = []
  let score = 0

  if (password.length === 0) {
    return { score: 0, feedback: ["请输入密码"] }
  }

  // 检查长度
  if (password.length < 8) {
    feedback.push("密码应至少包含8个字符")
  } else {
    score += 1
  }

  // 检查是否包含数字
  if (/\d/.test(password)) {
    score += 1
  } else {
    feedback.push("密码应包含数字")
  }

  // 检查是否包含小写字母
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push("密码应包含小写字母")
  }

  // 检查是否包含大写字母
  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push("密码应包含大写字母")
  }

  // 检查是否包含特殊字符
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1
  } else {
    feedback.push("密码应包含特殊字符")
  }

  return { score, feedback }
}

// 模拟登录尝试存储
// 在实际应用中，这应该存储在服务器端数据库中
const loginAttempts: Map<string, LoginAttempt> = new Map()

export function AuthPages({ onLogin, onRegister, onToggle, isLogin }: AuthProps) {
  // 手机登录状态
  const [phone, setPhone] = useState("")
  const [code, setCode] = useState("")
  const [codeSent, setCodeSent] = useState(false)
  const [phoneError, setPhoneError] = useState("")

  // 邮箱登录状态
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailError, setEmailError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")

  // 密码强度
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: [""] })

  // 邮箱验证
  const [emailVerificationSent, setEmailVerificationSent] = useState(false)
  const [emailVerificationCode, setEmailVerificationCode] = useState("")
  const [emailVerificationError, setEmailVerificationError] = useState("")

  // 忘记密码
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("")
  const [forgotPasswordDialogOpen, setForgotPasswordDialogOpen] = useState(false)
  const [resetPasswordCode, setResetPasswordCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [resetPasswordStep, setResetPasswordStep] = useState<"email" | "code" | "password">("email")
  const [resetPasswordError, setResetPasswordError] = useState("")

  // 账户锁定状态
  const [isAccountLocked, setIsAccountLocked] = useState(false)
  const [lockTimeRemaining, setLockTimeRemaining] = useState(0)
  const [unlockDialogOpen, setUnlockDialogOpen] = useState(false)
  const [unlockCode, setUnlockCode] = useState("")
  const [unlockError, setUnlockError] = useState("")
  const [unlockEmailSent, setUnlockEmailSent] = useState(false)

  // 登录方式
  const [authMethod, setAuthMethod] = useState<"phone" | "email">("phone")

  // 倒计时定时器
  const lockTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 当密码改变时，检查密码强度
  useEffect(() => {
    if (password) {
      setPasswordStrength(checkPasswordStrength(password))
    } else {
      setPasswordStrength({ score: 0, feedback: [""] })
    }
  }, [password])

  // 检查账户锁定状态
  useEffect(() => {
    const checkAccountLock = () => {
      const identifier = authMethod === "phone" ? phone : email
      if (!identifier) return

      const attempt = loginAttempts.get(identifier)
      if (!attempt) return

      const now = Date.now()

      // 如果锁定时间已过，解除锁定
      if (attempt.lockedUntil && attempt.lockedUntil < now) {
        attempt.lockedUntil = null
        loginAttempts.set(identifier, attempt)
        setIsAccountLocked(false)
        setLockTimeRemaining(0)
        if (lockTimerRef.current) {
          clearInterval(lockTimerRef.current)
          lockTimerRef.current = null
        }
        return
      }

      // 如果账户被锁定，更新锁定状态和剩余时间
      if (attempt.lockedUntil) {
        setIsAccountLocked(true)
        setLockTimeRemaining(Math.max(0, attempt.lockedUntil - now))

        // 设置定时器更新剩余时间
        if (!lockTimerRef.current) {
          lockTimerRef.current = setInterval(() => {
            const currentTime = Date.now()
            const timeRemaining = Math.max(0, (attempt.lockedUntil || 0) - currentTime)
            setLockTimeRemaining(timeRemaining)

            if (timeRemaining === 0) {
              setIsAccountLocked(false)
              if (lockTimerRef.current) {
                clearInterval(lockTimerRef.current)
                lockTimerRef.current = null
              }
            }
          }, 1000)
        }
      }
    }

    checkAccountLock()

    // 清理定时器
    return () => {
      if (lockTimerRef.current) {
        clearInterval(lockTimerRef.current)
        lockTimerRef.current = null
      }
    }
  }, [authMethod, phone, email])

  // 验证手机号
  const validatePhone = () => {
    if (!phone) {
      setPhoneError("请输入手机号码")
      return false
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setPhoneError("请输入有效的手机号码")
      return false
    }
    setPhoneError("")
    return true
  }

  // 验证邮箱
  const validateEmail = () => {
    if (!email) {
      setEmailError("请输入电子邮箱")
      return false
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError("请输入有效的电子邮箱")
      return false
    }
    setEmailError("")
    return true
  }

  // 验证密码
  const validatePassword = () => {
    if (!password) {
      setPasswordError("请输入密码")
      return false
    }
    if (password.length < 8) {
      setPasswordError("密码长度至少为8个字符")
      return false
    }
    setPasswordError("")
    return true
  }

  // 验证确认密码
  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError("请确认密码")
      return false
    }
    if (confirmPassword !== password) {
      setConfirmPasswordError("两次输入的密码不一致")
      return false
    }
    setConfirmPasswordError("")
    return true
  }

  // 发送手机验证码
  const sendPhoneCode = () => {
    if (!validatePhone()) return

    // 模拟发送验证码
    console.log("发送验证码到手机:", phone)
    setCodeSent(true)
    // 在实际应用中，这里会调用API发送验证码
  }

  // 发送邮箱验证码
  const sendEmailVerification = () => {
    if (!validateEmail()) return

    // 模拟发送验证邮件
    console.log("发送验证邮件到:", email)
    setEmailVerificationSent(true)
    // 在实际应用中，这里会调用API发送验证邮件
  }

  // 发送重置密码邮件
  const sendResetPasswordEmail = () => {
    if (!forgotPasswordEmail) {
      setResetPasswordError("请输入电子邮箱")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotPasswordEmail)) {
      setResetPasswordError("请输入有效的电子邮箱")
      return
    }

    // 模拟发送重置密码邮件
    console.log("发送重置密码邮件到:", forgotPasswordEmail)
    setResetPasswordStep("code")
    setResetPasswordError("")
    // 在实际应用中，这里会调用API发送重置密码邮件
  }

  // 验证重置密码验证码
  const verifyResetPasswordCode = () => {
    if (!resetPasswordCode) {
      setResetPasswordError("请输入验证码")
      return
    }

    // 模拟验证重置密码验证码
    console.log("验证重置密码验证码:", resetPasswordCode)
    setResetPasswordStep("password")
    setResetPasswordError("")
    // 在实际应用中，这里会调用API验证重置密码验证码
  }

  // 重置密码
  const resetPassword = () => {
    if (!newPassword) {
      setResetPasswordError("请输入新密码")
      return
    }
    if (newPassword.length < 8) {
      setResetPasswordError("密码长度至少为8个字符")
      return
    }

    // 模拟重置密码
    console.log("重置密码:", newPassword)
    setForgotPasswordDialogOpen(false)
    setResetPasswordStep("email")
    setForgotPasswordEmail("")
    setResetPasswordCode("")
    setNewPassword("")
    setResetPasswordError("")
    // 在实际应用中，这里会调用API重置密码
  }

  // 发送账户解锁邮件
  const sendUnlockEmail = () => {
    const identifier = authMethod === "phone" ? phone : email
    if (!identifier) {
      setUnlockError("请先输入您的账户信息")
      return
    }

    // 模拟发送解锁邮件
    console.log("发送解锁邮件到:", identifier)
    setUnlockEmailSent(true)
    setUnlockError("")
    // 在实际应用中，这里会调用API发送解锁邮件
  }

  // 验证解锁验证码
  const verifyUnlockCode = () => {
    if (!unlockCode) {
      setUnlockError("请输入验证码")
      return
    }

    const identifier = authMethod === "phone" ? phone : email
    if (!identifier) return

    // 模拟验证解锁验证码
    console.log("验证解锁验证码:", unlockCode)

    // 解锁账户
    const attempt = loginAttempts.get(identifier)
    if (attempt) {
      attempt.attempts = 0
      attempt.lockedUntil = null
      loginAttempts.set(identifier, attempt)
    }

    setIsAccountLocked(false)
    setLockTimeRemaining(0)
    setUnlockDialogOpen(false)
    setUnlockCode("")
    setUnlockEmailSent(false)
    setUnlockError("")

    // 在实际应用中，这里会调用API验证解锁验证码
  }

  // 记录登录尝试
  const recordLoginAttempt = (identifier: string, success: boolean) => {
    const now = Date.now()
    let attempt = loginAttempts.get(identifier)

    if (!attempt) {
      attempt = {
        identifier,
        attempts: 0,
        lastAttempt: now,
        lockedUntil: null,
      }
    }

    // 如果上次尝试是很久以前，重置尝试次数
    if (now - attempt.lastAttempt > ATTEMPT_RESET_TIME) {
      attempt.attempts = 0
    }

    attempt.lastAttempt = now

    if (!success) {
      attempt.attempts += 1

      // 如果尝试次数超过阈值，锁定账户
      if (attempt.attempts >= LOCK_THRESHOLD) {
        attempt.lockedUntil = now + LOCK_DURATION
        setIsAccountLocked(true)
        setLockTimeRemaining(LOCK_DURATION)
      }
    } else {
      // 登录成功，重置尝试次数
      attempt.attempts = 0
      attempt.lockedUntil = null
    }

    loginAttempts.set(identifier, attempt)
  }

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isAccountLocked) {
      return
    }

    if (isLogin) {
      if (!validatePhone()) return

      if (codeSent) {
        if (!code) {
          setPhoneError("请输入验证码")
          return
        }

        try {
          // 尝试登录
          const success = await onLogin(phone, code)
          recordLoginAttempt(phone, success)

          if (!success) {
            setPhoneError("验证码错误，请重试")
          }
        } catch (error) {
          console.error("登录失败:", error)
          setPhoneError("登录失败，请重试")
          recordLoginAttempt(phone, false)
        }
      } else {
        // 发送验证码
        sendPhoneCode()
      }
    } else {
      if (!validatePhone()) return

      // 注册
      onRegister(phone)
    }
  }

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isAccountLocked) {
      return
    }

    if (isLogin) {
      // 登录验证
      if (!validateEmail() || !validatePassword()) return

      try {
        // 尝试登录
        const success = await onLogin(email, password)
        recordLoginAttempt(email, success)

        if (!success) {
          setPasswordError("邮箱或密码错误，请重试")
        }
      } catch (error) {
        console.error("登录失败:", error)
        setPasswordError("登录失败，请重试")
        recordLoginAttempt(email, false)
      }
    } else {
      // 注册验证
      if (!validateEmail() || !validatePassword() || !validateConfirmPassword()) return

      if (!emailVerificationSent) {
        // 发送邮箱验证
        sendEmailVerification()
        return
      }

      if (!emailVerificationCode) {
        setEmailVerificationError("请输入验证码")
        return
      }

      // 验证邮箱验证码
      console.log("验证邮箱验证码:", emailVerificationCode)
      // 在实际应用中，这里会调用API验证邮箱验证码

      // 注册
      onRegister(email, password)
    }
  }

  // 获取密码强度颜色
  const getPasswordStrengthColor = () => {
    const { score } = passwordStrength
    if (score <= 1) return "bg-red-500"
    if (score <= 3) return "bg-yellow-500"
    return "bg-green-500"
  }

  // 获取密码强度文本
  const getPasswordStrengthText = () => {
    const { score } = passwordStrength
    if (score <= 1) return "弱"
    if (score <= 3) return "中"
    return "强"
  }

  // 格式化剩余锁定时间
  const formatLockTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000)
    const seconds = Math.floor((ms % 60000) / 1000)
    return `${minutes}分${seconds}秒`
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>{isLogin ? "登录" : "注册"}</CardTitle>
        <CardDescription>{isLogin ? "欢迎回来！请登录您的账户。" : "创建一个新账户以开始使用。"}</CardDescription>
      </CardHeader>
      <CardContent>
        {isAccountLocked && (
          <Alert variant="destructive" className="mb-4">
            <Lock className="h-4 w-4 mr-2" />
            <AlertDescription>
              <div className="flex flex-col">
                <span>账户已被临时锁定，请在 {formatLockTime(lockTimeRemaining)} 后重试。</span>
                <Button
                  variant="link"
                  className="p-0 h-auto mt-1 justify-start text-sm"
                  onClick={() => setUnlockDialogOpen(true)}
                >
                  立即解锁账户
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="phone" onValueChange={(value) => setAuthMethod(value as "phone" | "email")}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="phone">手机号码</TabsTrigger>
            <TabsTrigger value="email">电子邮箱</TabsTrigger>
          </TabsList>

          <TabsContent value="phone">
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phone">手机号码</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="输入您的手机号码"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={isAccountLocked}
                />
                {phoneError && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {phoneError}
                  </p>
                )}
              </div>
              {isLogin && codeSent && (
                <div className="space-y-2">
                  <Label htmlFor="code">验证码</Label>
                  <Input
                    id="code"
                    type="text"
                    placeholder="输入验证码"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                    disabled={isAccountLocked}
                  />
                </div>
              )}
              <Button type="submit" className="w-full" disabled={isAccountLocked}>
                {isLogin ? (codeSent ? "登录" : "发送验证码") : "注册"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="email">
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">电子邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="输入您的电子邮箱"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isAccountLocked}
                />
                {emailError && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {emailError}
                  </p>
                )}
              </div>

              {!isLogin && emailVerificationSent && (
                <div className="space-y-2">
                  <Label htmlFor="emailVerificationCode">验证码</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="emailVerificationCode"
                      type="text"
                      placeholder="输入邮箱验证码"
                      value={emailVerificationCode}
                      onChange={(e) => setEmailVerificationCode(e.target.value)}
                      required
                      disabled={isAccountLocked}
                    />
                    <Button type="button" variant="outline" onClick={sendEmailVerification} disabled={isAccountLocked}>
                      重新发送
                    </Button>
                  </div>
                  {emailVerificationError && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {emailVerificationError}
                    </p>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">密码</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={isAccountLocked}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isAccountLocked}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {passwordError && (
                  <p className="text-sm text-red-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {passwordError}
                  </p>
                )}

                {/* 密码强度指示器 */}
                {password && (
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="text-xs">密码强度:</span>
                      <span className="text-xs">{getPasswordStrengthText()}</span>
                    </div>
                    <Progress value={passwordStrength.score * 20} className={getPasswordStrengthColor()} />
                    {passwordStrength.feedback.length > 0 && (
                      <ul className="text-xs space-y-1 mt-2">
                        {passwordStrength.feedback.map((feedback, index) => (
                          <li key={index} className="flex items-center">
                            {passwordStrength.score >= 4 ? (
                              <Check className="h-3 w-3 text-green-500 mr-1" />
                            ) : (
                              <X className="h-3 w-3 text-red-500 mr-1" />
                            )}
                            {feedback}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">确认密码</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="再次输入密码"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      disabled={isAccountLocked}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isAccountLocked}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {confirmPasswordError && (
                    <p className="text-sm text-red-500 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {confirmPasswordError}
                    </p>
                  )}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isAccountLocked}>
                {isLogin ? "登录" : !emailVerificationSent ? "发送验证码" : "注册"}
              </Button>

              {isLogin && (
                <Dialog open={forgotPasswordDialogOpen} onOpenChange={setForgotPasswordDialogOpen}>
                  <DialogTrigger asChild>
                    <Button variant="link" className="w-full" disabled={isAccountLocked}>
                      忘记密码？
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>重置密码</DialogTitle>
                      <DialogDescription>
                        {resetPasswordStep === "email" && "请输入您的电子邮箱，我们将向您发送重置密码的验证码。"}
                        {resetPasswordStep === "code" && "请输入您收到的验证码。"}
                        {resetPasswordStep === "password" && "请设置新密码。"}
                      </DialogDescription>
                    </DialogHeader>

                    {resetPasswordError && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{resetPasswordError}</AlertDescription>
                      </Alert>
                    )}

                    {resetPasswordStep === "email" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="forgotPasswordEmail">电子邮箱</Label>
                          <Input
                            id="forgotPasswordEmail"
                            type="email"
                            placeholder="输入您的电子邮箱"
                            value={forgotPasswordEmail}
                            onChange={(e) => setForgotPasswordEmail(e.target.value)}
                          />
                        </div>
                        <Button onClick={sendResetPasswordEmail} className="w-full">
                          发送验证码
                        </Button>
                      </div>
                    )}

                    {resetPasswordStep === "code" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="resetPasswordCode">验证码</Label>
                          <Input
                            id="resetPasswordCode"
                            type="text"
                            placeholder="输入验证码"
                            value={resetPasswordCode}
                            onChange={(e) => setResetPasswordCode(e.target.value)}
                          />
                        </div>
                        <Button onClick={verifyResetPasswordCode} className="w-full">
                          验证
                        </Button>
                      </div>
                    )}

                    {resetPasswordStep === "password" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="newPassword">新密码</Label>
                          <Input
                            id="newPassword"
                            type="password"
                            placeholder="输入新密码"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                          />
                        </div>
                        <Button onClick={resetPassword} className="w-full">
                          重置密码
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              )}
            </form>
          </TabsContent>
        </Tabs>

        {/* 账户解锁对话框 */}
        <Dialog open={unlockDialogOpen} onOpenChange={setUnlockDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>解锁账户</DialogTitle>
              <DialogDescription>
                {!unlockEmailSent ? "您的账户已被临时锁定。请验证您的身份以立即解锁账户。" : "请输入您收到的验证码。"}
              </DialogDescription>
            </DialogHeader>

            {unlockError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{unlockError}</AlertDescription>
              </Alert>
            )}

            {!unlockEmailSent ? (
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Lock className="h-5 w-5 text-amber-500" />
                  <p className="text-sm">由于多次登录失败，您的账户已被临时锁定，以保护您的账户安全。</p>
                </div>
                <Button onClick={sendUnlockEmail} className="w-full">
                  发送验证码
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="unlockCode">验证码</Label>
                  <Input
                    id="unlockCode"
                    type="text"
                    placeholder="输入验证码"
                    value={unlockCode}
                    onChange={(e) => setUnlockCode(e.target.value)}
                  />
                </div>
                <Button onClick={verifyUnlockCode} className="w-full">
                  验证并解锁
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </CardContent>
      <CardFooter>
        <Button variant="link" onClick={onToggle} className="w-full" disabled={isAccountLocked}>
          {isLogin ? "没有账户？注册" : "已有账户？登录"}
        </Button>
      </CardFooter>
    </Card>
  )
}

