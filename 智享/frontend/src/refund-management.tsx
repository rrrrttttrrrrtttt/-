import { useState } from 'react'
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog"
import { Label } from "@/src/components/ui/label"
import { Input } from "@/src/components/ui/input"
import { toast } from "@/src/components/ui/use-toast"

interface RefundRequest {
  id: string;
  customerName: string;
  contentTitle: string;
  amount: number;
  reason: string;
  status: '待处理' | '已批准' | '已拒绝';
}

const initialRefundRequests: RefundRequest[] = [
  { id: '1', customerName: '张三', contentTitle: 'React Hooks 精通', amount: 49.99, reason: '内容描述不符', status: '待处理' },
  { id: '2', customerName: '李四', contentTitle: '高级状态管理', amount: 39.99, reason: '技术问题', status: '待处理' },
  { id: '3', customerName: '王五', contentTitle: 'GraphQL 基础', amount: 29.99, reason: '意外购买', status: '待处理' },
];

export default function RefundManagement() {
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>(initialRefundRequests);
  const [selectedRequest, setSelectedRequest] = useState<RefundRequest | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleApproveRefund = () => {
    if (selectedRequest) {
      const updatedRequests = refundRequests.map(request =>
        request.id === selectedRequest.id ? { ...request, status: '已批准' as const } : request
      );
      setRefundRequests(updatedRequests);
      setIsDialogOpen(false);
      toast({
        title: "退款已批准",
        description: `${selectedRequest.customerName} 的退款请求已被批准。`,
      });
    }
  };

  const handleRejectRefund = () => {
    if (selectedRequest) {
      const updatedRequests = refundRequests.map(request =>
        request.id === selectedRequest.id ? { ...request, status: '已拒绝' as const } : request
      );
      setRefundRequests(updatedRequests);
      setIsDialogOpen(false);
      toast({
        title: "退款已拒绝",
        description: `${selectedRequest.customerName} 的退款请求已被拒绝。`,
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>退款管理</CardTitle>
          <CardDescription>审核和处理退款请求</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>客户</TableHead>
                <TableHead>内容</TableHead>
                <TableHead>金额</TableHead>
                <TableHead>原因</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {refundRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell>{request.customerName}</TableCell>
                  <TableCell>{request.contentTitle}</TableCell>
                  <TableCell>¥{request.amount.toFixed(2)}</TableCell>
                  <TableCell>{request.reason}</TableCell>
                  <TableCell>{request.status}</TableCell>
                  <TableCell>
                    {request.status === '待处理' && (
                      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" onClick={() => setSelectedRequest(request)}>
                            审核
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>审核退款请求</DialogTitle>
                            <DialogDescription>
                              请审核以下退款请求详情。
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="customer" className="text-right">
                                客户
                              </Label>
                              <Input id="customer" value={selectedRequest?.customerName} className="col-span-3" readOnly />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="content" className="text-right">
                                内容
                              </Label>
                              <Input id="content" value={selectedRequest?.contentTitle} className="col-span-3" readOnly />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="amount" className="text-right">
                                金额
                              </Label>
                              <Input id="amount" value={`¥${selectedRequest?.amount.toFixed(2)}`} className="col-span-3" readOnly />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                              <Label htmlFor="reason" className="text-right">
                                原因
                              </Label>
                              <Input id="reason" value={selectedRequest?.reason} className="col-span-3" readOnly />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={handleRejectRefund}>
                              拒绝
                            </Button>
                            <Button onClick={handleApproveRefund}>
                              批准退款
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

