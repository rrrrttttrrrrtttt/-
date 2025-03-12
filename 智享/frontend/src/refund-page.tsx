import { useState } from 'react'
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { toast } from "@/src/components/ui/use-toast"

interface RefundPageProps {
  onNavigate: (page: string) => void;
}

export default function RefundPage({ onNavigate }: RefundPageProps) {
  const [reason, setReason] = useState('')
  const [additionalInfo, setAdditionalInfo] = useState('')

  const handleRefundRequest = () => {
    // In a real app, this would send the refund request to a server
    console.log('Refund requested:', { reason, additionalInfo })
    toast({
      title: "Refund Request Submitted",
      description: "We'll process your request and get back to you soon.",
    })
    onNavigate('home')
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Request a Refund</CardTitle>
          <CardDescription>Please provide details for your refund request</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="purchase">Purchase</Label>
            <Select defaultValue="react-hooks">
              <SelectTrigger id="purchase">
                <SelectValue placeholder="Select a purchase" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="react-hooks">Mastering React Hooks ($49.99)</SelectItem>
                <SelectItem value="graphql">GraphQL Mastery ($24.99)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Refund</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="reason">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-as-described">Not as described</SelectItem>
                <SelectItem value="technical-issues">Technical issues</SelectItem>
                <SelectItem value="accidental-purchase">Accidental purchase</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="additional-info">Additional Information</Label>
            <Textarea 
              id="additional-info" 
              placeholder="Please provide more details about your refund request" 
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleRefundRequest} className="w-full">Submit Refund Request</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

