import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Button } from "@/src/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/src/components/ui/dialog"
import { Heart, MessageCircle, DollarSign } from 'lucide-react'

interface HomePageProps {
onViewContent: (id: string) => void
onNavigate: (page: string, params?: any) => void
}

interface ContentItem {
id: string
title: string
description: string
author: {
  id: string
  name: string
  avatar: string
}
price: number
}

interface FanItem {
id: string
name: string
avatar: string
action: 'followed' | 'purchased'
content?: string
bio?: string
}

const followedContent: ContentItem[] = [
{
  id: '1',
  title: 'React Hooks 精通：全面指南',
  description: '学习如何在项目中充分利用 React Hooks 的力量',
  author: {
    id: 'author1',
    name: '张三',
    avatar: '/placeholder.svg?height=30&width=30'
  },
  price: 5
},
{
  id: '2',
  title: '使用 GraphQL 构建可扩展的 API',
  description: '优化你的后端以满足复杂的数据需求',
  author: {
    id: 'author2',
    name: '李四',
    avatar: '/placeholder.svg?height=30&width=30'
  },
  price: 8
}
]

const fans: FanItem[] = [
{
  id: '1',
  name: '王五',
  avatar: '/placeholder.svg?height=30&width=30',
  action: 'followed',
  bio: '热衷于 Web 开发，总是渴望学习新技术。'
},
{
  id: '2',
  name: '赵六',
  avatar: '/placeholder.svg?height=30&width=30',
  action: 'purchased',
  content: 'React Hooks 精通：全面指南',
  bio: '前端开发者，专注于创建直观的用户界面。'
}
]

export default function HomePage({ onViewContent, onNavigate }: HomePageProps) {
const [selectedFan, setSelectedFan] = useState<FanItem | null>(null)
const [likedContent, setLikedContent] = useState<Set<string>>(new Set());
const [likedFans, setLikedFans] = useState<Set<string>>(new Set());

const handleChatClick = (authorId: string, authorName: string) => {
  onNavigate('messaging', { userId: authorId, userName: authorName });
};

const handleLike = (contentId: string) => {
  setLikedContent(prev => {
    const newLiked = new Set(prev);
    if (newLiked.has(contentId)) {
      newLiked.delete(contentId);
    } else {
      newLiked.add(contentId);
    }
    return newLiked;
  });
};

const handleLikeFan = (fanId: string) => {
  setLikedFans(prev => {
    const newLiked = new Set(prev);
    if (newLiked.has(fanId)) {
      newLiked.delete(fanId);
    } else {
      newLiked.add(fanId);
    }
    return newLiked;
  });
};

return (
  <div className="w-full p-4">
    <Tabs defaultValue="followed" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="followed">关注</TabsTrigger>
        <TabsTrigger value="fans">粉丝</TabsTrigger>
      </TabsList>
      <TabsContent value="followed" className="space-y-4">
        {followedContent.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center mt-4 text-sm text-muted-foreground">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={item.author.avatar} alt={item.author.name} />
                  <AvatarFallback>{item.author.name[0]}</AvatarFallback>
                </Avatar>
                <span>作者：{item.author.name}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => onViewContent(item.id)}>查看内容 (¥{item.price})</Button>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" onClick={() => handleChatClick(item.author.id, item.author.name)}>
                  <MessageCircle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleLike(item.id)}>
                  <Heart className={`h-4 w-4 ${likedContent.has(item.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </TabsContent>
      <TabsContent value="fans" className="space-y-4">
        {fans.map((fan) => (
          <Card key={fan.id}>
            <CardContent className="flex items-center p-4">
              <Avatar className="h-10 w-10 mr-4">
                <AvatarImage src={fan.avatar} alt={fan.name} />
                <AvatarFallback>{fan.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <h3 className="font-semibold">{fan.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {fan.action === 'followed' ? (
                    <>
                      <Heart className="inline-block w-4 h-4 mr-1" />
                      关注了你
                    </>
                  ) : (
                    <>
                      <DollarSign className="inline-block w-4 h-4 mr-1" />
                      购买了：{fan.content}
                    </>
                  )}
                </p>
              </div>
              <div className="flex space-x-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" onClick={() => setSelectedFan(fan)}>
                      个人资料
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle className="flex items-center">
                        <Avatar className="h-10 w-10 mr-2">
                          <AvatarImage src={selectedFan?.avatar} alt={selectedFan?.name} />
                          <AvatarFallback>{selectedFan?.name[0]}</AvatarFallback>
                        </Avatar>
                        {selectedFan?.name}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">简介</h4>
                      <p>{selectedFan?.bio}</p>
                    </div>
                    <div className="mt-4">
                      <h4 className="font-semibold mb-2">动态</h4>
                      <p>
                        {selectedFan?.action === 'followed' ? (
                          <>
                            <Heart className="inline-block w-4 h-4 mr-1" />
                            关注了你
                          </>
                        ) : (
                          <>
                            <DollarSign className="inline-block w-4 h-4 mr-1" />
                            购买了：{selectedFan?.content}
                          </>
                        )}
                      </p>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => onNavigate('messaging', { userId: fan.id, userName: fan.name })}
                >
                  <MessageCircle className="h-4 w-4 mr-2" />
                  聊天
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleLikeFan(fan.id)}
                >
                  <Heart className={`h-4 w-4 ${likedFans.has(fan.id) ? 'fill-red-500 text-red-500' : ''}`} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>
    </Tabs>
  </div>
)
}

