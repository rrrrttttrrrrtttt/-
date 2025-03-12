import { useState } from 'react'
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Switch } from "@/src/components/ui/switch"
import { Textarea } from "@/src/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"

interface UserSettingsPageProps {
  onNavigate: (page: string) => void;
}

export default function UserSettingsPage({ onNavigate }: UserSettingsPageProps) {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>个人资料设置</CardTitle>
          <CardDescription>管理您的个人资料信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">姓名</Label>
            <Input id="name" defaultValue="张三" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">电子邮箱</Label>
            <Input id="email" type="email" defaultValue="zhangsan@example.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">个人简介</Label>
            <Textarea id="bio" defaultValue="Web 开发专家" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>保存更改</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>账户设置</CardTitle>
          <CardDescription>管理您的账户偏好</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="notifications">启用通知</Label>
            <Switch
              id="notifications"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="darkMode">深色模式</Label>
            <Switch
              id="darkMode"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>安全</CardTitle>
          <CardDescription>管理您的账户安全</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword">当前密码</Label>
            <Input id="currentPassword" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="newPassword">新密码</Label>
            <Input id="newPassword" type="password" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">确认新密码</Label>
            <Input id="confirmPassword" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button>更改密码</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>购买管理</CardTitle>
          <CardDescription>管理您的购买和争议</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => onNavigate('purchaseManagement')}>查看购买历史</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>应用信息</CardTitle>
          <CardDescription>查看应用版本和其他信息</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex justify-between">
            <span>应用版本</span>
            <span>1.0.0</span>
          </div>
          <div className="flex justify-between">
            <span>最后更新</span>
            <span>2023年7月1日</span>
          </div>
          <div className="flex justify-between">
            <span>开发者</span>
            <span>智享科技</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">检查更新</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

