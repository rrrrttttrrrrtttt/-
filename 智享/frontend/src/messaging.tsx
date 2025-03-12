import { useState, useEffect } from 'react'
import { Send, ArrowLeft } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Input } from "@/src/components/ui/input"
import { ScrollArea } from "@/src/components/ui/scroll-area"

interface Message {
  id: number;
  sender: string;
  content: string;
  timestamp: string;
}

interface ChatPerson {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  unreadCount: number;
}

interface MessagingProps {
  userId?: string | null;
  userName?: string | null;
  onNavigate: (page: string) => void;
}

const chatList: ChatPerson[] = [
  { id: 'author1', name: '张三', avatar: '/placeholder.svg?height=40&width=40', lastMessage: '谢谢你的帮助！', unreadCount: 0 },
  { id: 'author2', name: '李四', avatar: '/placeholder.svg?height=40&width=40', lastMessage: '下一个教程什么时候发布？', unreadCount: 2 },
  { id: 'author3', name: '王五', avatar: '/placeholder.svg?height=40&width=40', lastMessage: '课程很棒！', unreadCount: 1 },
]

const mockMessages: Record<string, Message[]> = {
  'author1': [
    { id: 1, sender: '张三', content: '你好！我看了你的 React Hooks 教程，有个问题想请教。', timestamp: '10:30' },
    { id: 2, sender: '你', content: '你好！当然可以，你想了解什么？', timestamp: '10:32' },
    { id: 3, sender: '张三', content: '我对 useCallback 的理解还有些困惑。能再详细解释一下吗？', timestamp: '10:35' },
    { id: 4, sender: '你', content: 'useCallback 用于记忆化函数...', timestamp: '10:40' },
    { id: 5, sender: '张三', content: '谢谢你的帮助！', timestamp: '10:45' },
  ],
  'author2': [
    { id: 1, sender: '李四', content: '嘿，我真的很喜欢你上一个教程！', timestamp: '14:15' },
    { id: 2, sender: '你', content: '谢谢，李四！我很高兴你觉得有帮助。', timestamp: '14:20' },
    { id: 3, sender: '李四', content: '下一个教程什么时候发布？', timestamp: '14:22' },
    { id: 4, sender: '李四', content: '我真的很期待！', timestamp: '14:23' },
  ],
  'author3': [
    { id: 1, sender: '王五', content: '我刚刚完成了你的高级 React 模式课程。', timestamp: '11:05' },
    { id: 2, sender: '你', content: '太好了，王五！你觉得怎么样？', timestamp: '11:10' },
    { id: 3, sender: '王五', content: '课程很棒！我学到了很多。', timestamp: '11:15' },
  ],
}

export default function Messaging({ userId, userName, onNavigate }: MessagingProps) {
  const [selectedUser, setSelectedUser] = useState<ChatPerson | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    if (userId && userName) {
      const user = chatList.find(chat => chat.id === userId) || { id: userId, name: userName, avatar: '/placeholder.svg?height=40&width=40', lastMessage: '', unreadCount: 0 };
      setSelectedUser(user);
      setMessages(mockMessages[userId] || []);
    } else {
      setSelectedUser(null);
      setMessages([]);
    }
  }, [userId, userName]);

  const handleSelectUser = (user: ChatPerson) => {
    setSelectedUser(user)
    setMessages(mockMessages[user.id])
  }

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedUser) {
      const newMsg: Message = {
        id: messages.length + 1,
        sender: '你',
        content: newMessage.trim(),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
      setMessages([...messages, newMsg])
      setNewMessage('')
    }
  }

  const renderChatList = () => (
    <ScrollArea className="flex-1">
      {chatList.map((chat) => (
        <Card key={chat.id} className="mb-2 cursor-pointer hover:bg-accent" onClick={() => handleSelectUser(chat)}>
          <CardContent className="flex items-center p-4">
            <Avatar className="h-12 w-12 mr-4">
              <AvatarImage src={chat.avatar} alt={chat.name} />
              <AvatarFallback>{chat.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">{chat.name}</h3>
              <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
            </div>
            {chat.unreadCount > 0 && (
              <div className="bg-primary text-primary-foreground rounded-full px-2 py-1 text-xs">
                {chat.unreadCount}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </ScrollArea>
  )

  const renderChat = () => (
    <>
      <ScrollArea className="flex-1 p-4">
        {messages.map((message) => (
          <Card key={message.id} className={`mb-4 ${message.sender === '你' ? 'ml-auto bg-primary text-primary-foreground' : 'mr-auto bg-secondary'}`} style={{maxWidth: '80%'}}>
            <CardHeader className="p-3">
              <CardTitle className="text-sm font-semibold">{message.sender}</CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0">
              <p className="text-sm">{message.content}</p>
              <p className="text-xs text-muted-foreground mt-1">{message.timestamp}</p>
            </CardContent>
          </Card>
        ))}
      </ScrollArea>

      <div className="p-4 border-t">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="输入消息..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            className="flex-1 mr-2"
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </>
  )

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background text-foreground">
      <header className="flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" onClick={() => selectedUser ? setSelectedUser(null) : onNavigate('home')} className="mr-2">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h2 className="font-semibold text-lg">{selectedUser ? selectedUser.name : '消息'}</h2>
      </header>

      {!selectedUser ? renderChatList() : renderChat()}
    </div>
  )
}

