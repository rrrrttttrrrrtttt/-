import { useState } from 'react'
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/src/components/ui/card"

interface PurchaseFinancePageProps {
  onNavigate: (page: string) => void;
}

export default function PurchaseFinancePage({ onNavigate }: PurchaseFinancePageProps) {
  const [paymentMethod, setPaymentMethod] = useState('credit-card')

  const handleCompletePurchase = () => {
    // 在实际应用中，这里会处理支付流程
    console.log('购买完成')
    onNavigate('home')
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>购买内容</CardTitle>
          <CardDescription>完成您的购买以访问内容</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="content-name">内容名称</Label>
            <Input id="content-name" value="掌握 React Hooks" readOnly />
          </div>
          <div>
            <Label htmlFor="price">价格</Label>
            <Input id="price" value="¥49.99" readOnly />
          </div>
          <div>
            <Label>支付方式</Label>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="credit-card" id="credit-card" />
                <Label htmlFor="credit-card">信用卡</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="alipay" id="alipay" />
                <Label htmlFor="alipay">支付宝</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wechat" id="wechat" />
                <Label htmlFor="wechat">微信支付</Label>
              </div>
            </RadioGroup>
          </div>
          {paymentMethod === 'credit-card' && (
            <>
              <div>
                <Label htmlFor="card-number">卡号</Label>
                <Input id="card-number" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="flex space-x-4">
                <div className="flex-1">
                  <Label htmlFor="expiry-date">有效期</Label>
                  <Input id="expiry-date" placeholder="MM/YY" />
                </div>
                <div className="flex-1">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input id="cvv" placeholder="123" />
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="flex-col space-y-2">
          <Button className="w-full" onClick={handleCompletePurchase}>完成购买</Button>
          <Button variant="link" onClick={() => onNavigate('refund')} className="text-sm text-muted-foreground hover:text-primary">
            需要退款？点击这里
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

