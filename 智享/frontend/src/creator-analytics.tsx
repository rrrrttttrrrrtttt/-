import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { DollarSign, Users, AlertCircle } from 'lucide-react'
import { performCustomerService } from '../customer-service'

const creatorData = [
  { name: '周一', views: 400, earnings: 240 },
  { name: '周二', views: 300, earnings: 139 },
  { name: '周三', views: 200, earnings: 980 },
  { name: '周四', views: 278, earnings: 390 },
  { name: '周五', views: 189, earnings: 480 },
  { name: '周六', views: 239, earnings: 380 },
  { name: '周日', views: 349, earnings: 430 },
]

const purchaseData = [
  { name: '周一', purchases: 5, revenue: 150 },
  { name: '周二', purchases: 3, revenue: 90 },
  { name: '周三', purchases: 7, revenue: 210 },
  { name: '周四', purchases: 4, revenue: 120 },
  { name: '周五', purchases: 6, revenue: 180 },
  { name: '周六', purchases: 8, revenue: 240 },
  { name: '周日', purchases: 5, revenue: 150 },
]

const recentPurchases = [
  { id: 1, title: 'React Hooks 精通', price: 49.99 },
  { id: 2, title: '高级状态管理', price: 39.99 },
  { id: 3, title: 'GraphQL 基础', price: 29.99 },
]

interface CreatorAnalyticsProps {
  onNavigate: (page: string) => void;
}

export default function CreatorAnalytics({ onNavigate }: CreatorAnalyticsProps) {
  const [customerServiceAction, setCustomerServiceAction] = useState('refund');
  const [userId, setUserId] = useState('');
  const [contentId, setContentId] = useState('');
  const [amount, setAmount] = useState('');
  const [duration, setDuration] = useState('');
  const [message, setMessage] = useState('');
  const [reason, setReason] = useState('');

  const handleCustomerServiceAction = async () => {
    const success = await performCustomerService({
      action: customerServiceAction as 'refund' | 'extend-access' | 'send-message' | 'flag-account',
      userId,
      contentId,
      amount: amount ? parseFloat(amount) : undefined,
      duration: duration ? parseInt(duration) : undefined,
      message,
      reason,
    });

    if (success) {
      setUserId('');
      setContentId('');
      setAmount('');
      setDuration('');
      setMessage('');
      setReason('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-[#FFF8E1] text-[#5D4037]">
      <h1 className="text-3xl font-bold mb-6">分析仪表板</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <Card>
          <CardHeader>
            <CardTitle>管理退款</CardTitle>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => onNavigate('refundManagement')}>
              管理退款
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>最近购买</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {recentPurchases.map((purchase) => (
                <li key={purchase.id} className="flex justify-between items-center">
                  <span className="truncate">{purchase.title}</span>
                  <span className="flex items-center text-green-600">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {purchase.price.toFixed(2)}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => onNavigate('purchaseManagement')}>
              查看所有购买
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <Tabs defaultValue="creator" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="creator">创作者分析</TabsTrigger>
          <TabsTrigger value="purchase">购买分析</TabsTrigger>
          <TabsTrigger value="customer-service">客户服务</TabsTrigger>
        </TabsList>

        <TabsContent value="creator">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总浏览量</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,955</div>
                <p className="text-xs text-muted-foreground">较上周增长 20.1%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总收入</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥3,039</div>
                <p className="text-xs text-muted-foreground">较上月增长 15%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">平均评分</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.8</div>
                <p className="text-xs text-muted-foreground">基于 56 条评价</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>每周表现</CardTitle>
              <CardDescription>过去一周的内容浏览量和收入</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={creatorData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="views" fill="#8884d8" name="浏览量" />
                  <Bar yAxisId="right" dataKey="earnings" fill="#82ca9d" name="收入 (¥)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>表现最佳的内容</CardTitle>
              <CardDescription>您浏览量最高和收入最多的内容</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">React Hooks 精通</p>
                    <p className="text-sm text-muted-foreground">发布于 2023年6月1日</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">1,245 次浏览</p>
                    <p className="text-sm text-muted-foreground">¥623 收入</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">高级状态管理</p>
                    <p className="text-sm text-muted-foreground">发布于 2023年5月15日</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">987 次浏览</p>
                    <p className="text-sm text-muted-foreground">¥494 收入</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="purchase">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总购买量</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">38</div>
                <p className="text-xs text-muted-foreground">较上周增长 12.5%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">总收入</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥1,140</div>
                <p className="text-xs text-muted-foreground">较上月增长 18%</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">平均购买价值</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">¥30</div>
                <p className="text-xs text-muted-foreground">基于 38 次购买</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>每周购买表现</CardTitle>
              <CardDescription>过去一周的购买次数和收入</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={purchaseData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Bar yAxisId="left" dataKey="purchases" fill="#8884d8" name="购买次数" />
                  <Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="收入 (¥)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>销量最高的内容</CardTitle>
              <CardDescription>您购买次数最多和收入最高的内容</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">React Hooks 精通</p>
                    <p className="text-sm text-muted-foreground">发布于 2023年6月1日</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">15 次购买</p>
                    <p className="text-sm text-muted-foreground">¥450 收入</p>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">高级状态管理</p>
                    <p className="text-sm text-muted-foreground">发布于 2023年5月15日</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">12 次购买</p>
                    <p className="text-sm text-muted-foreground">¥360 收入</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customer-service">
          <Card>
            <CardHeader>
              <CardTitle>客户服务操作</CardTitle>
              <CardDescription>为您的用户执行客户服务任务</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="action">操作</Label>
                  <Select value={customerServiceAction} onValueChange={setCustomerServiceAction}>
                    <SelectTrigger id="action">
                      <SelectValue placeholder="选择一个操作" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="refund">发起退款</SelectItem>
                      <SelectItem value="extend-access">延长内容访问</SelectItem>
                      <SelectItem value="send-message">发送个性化消息</SelectItem>
                      <SelectItem value="flag-account">标记账户审核</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="userId">用户 ID</Label>
                  <Input id="userId" value={userId} onChange={(e) => setUserId(e.target.value)} />
                </div>

                {(customerServiceAction === 'refund' || customerServiceAction === 'extend-access') && (
                  <div className="space-y-2">
                    <Label htmlFor="contentId">内容 ID</Label>
                    <Input id="contentId" value={contentId} onChange={(e) => setContentId(e.target.value)} />
                  </div>
                )}

                {customerServiceAction === 'refund' && (
                  <div className="space-y-2">
                    <Label htmlFor="amount">退款金额</Label>
                    <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
                  </div>
                )}

                {customerServiceAction === 'extend-access' && (
                  <div className="space-y-2">
                    <Label htmlFor="duration">延长时间（天）</Label>
                    <Input id="duration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
                  </div>
                )}

                {customerServiceAction === 'send-message' && (
                  <div className="space-y-2">
                    <Label htmlFor="message">消息</Label>
                    <Input id="message" value={message} onChange={(e) => setMessage(e.target.value)} />
                  </div>
                )}

                {customerServiceAction === 'flag-account' && (
                  <div className="space-y-2">
                    <Label htmlFor="reason">标记原因</Label>
                    <Input id="reason" value={reason} onChange={(e) => setReason(e.target.value)} />
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleCustomerServiceAction}>执行操作</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

