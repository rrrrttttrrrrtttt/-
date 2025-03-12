import { useState } from 'react'
import { Bell, MessageCircle, Star, DollarSign } from 'lucide-react'
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card"
import { ScrollArea } from "@/src/components/ui/scroll-area"

interface Notification {
  id: string;
  type: 'message' | 'review' | 'sale';
  content: string;
  timestamp: string;
}

const initialNotifications: Notification[] = [
  { id: '1', type: 'message', content: 'New message from Jane Doe', timestamp: '5 minutes ago' },
  { id: '2', type: 'review', content: 'You received a 5-star review!', timestamp: '1 hour ago' },
  { id: '3', type: 'sale', content: 'Your content "React Hooks" was purchased', timestamp: '2 hours ago' },
  { id: '4', type: 'message', content: 'New message from John Smith', timestamp: '3 hours ago' },
]

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)

  const clearNotifications = () => {
    setNotifications([])
  }

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="h-5 w-5 text-blue-500" />
      case 'review':
        return <Star className="h-5 w-5 text-yellow-500" />
      case 'sale':
        return <DollarSign className="h-5 w-5 text-green-500" />
    }
  }

  return (
    <div className="max-w-md mx-auto p-4 bg-background text-foreground">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <Button variant="outline" size="sm" onClick={clearNotifications}>
          Clear All
        </Button>
      </div>
      
      <ScrollArea className="h-[70vh]">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No new notifications
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card key={notification.id} className="mb-4">
              <CardHeader className="flex flex-row items-center gap-4 pb-2">
                {getIcon(notification.type)}
                <div className="grid gap-1">
                  <CardTitle className="text-sm font-medium">{notification.content}</CardTitle>
                  <CardDescription className="text-xs">{notification.timestamp}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          ))
        )}
      </ScrollArea>
    </div>
  )
}

