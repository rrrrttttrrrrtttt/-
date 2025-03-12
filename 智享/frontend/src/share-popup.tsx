import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/src/components/ui/dialog"
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Facebook, Twitter, Linkedin, Link } from 'lucide-react'

interface SharePopupProps {
  contentTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SharePopup({ contentTitle, open, onOpenChange }: SharePopupProps) {
  const [copied, setCopied] = useState(false)
  const shareUrl = `https://brainshare.com/content/${encodeURIComponent(contentTitle)}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>分享此内容</DialogTitle>
          <DialogDescription>
            将"{contentTitle}"分享给您的网络
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              链接
            </Label>
            <Input
              id="link"
              defaultValue={shareUrl}
              readOnly
            />
          </div>
          <Button type="submit" size="sm" className="px-3" onClick={copyToClipboard}>
            <span className="sr-only">复制</span>
            {copied ? '已复制！' : '复制'}
          </Button>
        </div>
        <div className="flex justify-around mt-4">
          <Button variant="outline" size="icon">
            <Facebook className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Twitter className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Linkedin className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

