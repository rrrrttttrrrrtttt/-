import { useState } from 'react'
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import { Textarea } from "@/src/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { toast } from "@/src/components/ui/use-toast"

interface Purchase {
  id: string;
  contentTitle: string;
  price: number;
  purchaseDate: string;
  status: '已完成' | '处理中' | '有争议';
}

const initialPurchases: Purchase[] = [
  { id: '1', contentTitle: 'React Hooks 精通', price: 49.99, purchaseDate: '2023-07-01', status: '已完成' },
  { id: '2', contentTitle: '高级状态管理', price: 39.99, purchaseDate: '2023-07-05', status: '已完成' },
  { id: '3', contentTitle: 'GraphQL 基础', price: 29.99, purchaseDate: '2023-07-10', status: '处理中' },
];

export default function PurchaseManagementPage() {
  const [purchases, setPurchases] = useState<Purchase[]>(initialPurchases);
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');
  const [disputeDescription, setDisputeDescription] = useState('');

  const handleDisputePurchase = () => {
    if (selectedPurchase && disputeReason) {
      const updatedPurchases = purchases.map(purchase =>
        purchase.id === selectedPurchase.id ? { ...purchase, status: '有争议' as const } : purchase
      );
      setPurchases(updatedPurchases);
      setIsDialogOpen(false);
      toast({
        title: "购买已标记为有争议",
        description: `您对 ${selectedPurchase.contentTitle} 的争议已提交。`,
      });
      setDisputeReason('');
      setDisputeDescription('');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>购买管理</CardTitle>
          <CardDescription>查看和管理您的购买</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>内容</TableHead>
                <TableHead>价格</TableHead>
                <TableHead>购买日期</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>{purchase.contentTitle}</TableCell>
                  <TableCell>¥{purchase.price.toFixed(2)}</TableCell>
                  <TableCell>{purchase.purchaseDate}</TableCell>
                  <TableCell>{purchase.status}</TableCell>
                  <TableCell>
                    {purchase.status === '已完成' && (
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" onClick={() => setSelectedPurchase(purchase)}>
                            提出争议
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>提出购买争议</DialogTitle>
                            <DialogDescription>
                              请提供有关您争议的详细信息。
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="content" className="text-right">
                                内容
                              </Label>
                              <Input id="content" value={selectedPurchase?.contentTitle} className="col-span-3" readOnly />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="reason" className="text-right">
                                原因
                              </Label>
                              <Select onValueChange={setDisputeReason}>
                                <SelectTrigger className="col-span-3">
                                  <SelectValue placeholder="选择一个原因" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="not-as-described">内容描述不符</SelectItem>
                                  <SelectItem value="technical-issues">技术问题</SelectItem>
                                  <SelectItem value="accidental-purchase">意外购买</SelectItem>
                                  <SelectItem value="other">其他</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="description" className="text-right">
                                描述
                              </Label>
                              <Textarea 
                                id="description" 
                                placeholder="请提供更多关于您争议的详细信息"
                                className="col-span-3"
                                value={disputeDescription}
                                onChange={(e) => setDisputeDescription(e.target.value)}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                              取消
                            </Button>
                            <Button onClick={handleDisputePurchase}>
                              提交争议
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

