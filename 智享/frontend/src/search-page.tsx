import { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Button } from "@/src/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { Input } from "@/src/components/ui/input"
import { Heart, MessageCircle } from 'lucide-react'

interface SearchPageProps {
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

const discoverContent: ContentItem[] = [
{
  id: '3',
  title: 'Next.js 13 深入探索：App 目录和服务器组件',
  description: '掌握 Next.js 的最新特性以获得最佳性能',
  author: {
    id: 'author3',
    name: '王五',
    avatar: '/placeholder.svg?height=30&width=30'
  },
  price: 10
}
]

const recommendedContent: ContentItem[] = [
{
  id: '4',
  title: '设计直观的用户界面：全面指南',
  description: '提升您的设计技能并创建用户友好的界面',
  author: {
    id: 'author4',
    name: '赵六',
    avatar: '/placeholder.svg?height=30&width=30'
  },
  price: 15
}
]

export default function SearchPage({ onViewContent, onNavigate }: SearchPageProps) {
const [searchQuery, setSearchQuery] = useState('')
const [likedContent, setLikedContent] = useState<Set<string>>(new Set())

const handleLike = (contentId: string) => {
  setLikedContent(prev => {
    const newLiked = new Set(prev)
    if (newLiked.has(contentId)) {
      newLiked.delete(contentId)
    } else {
      newLiked.add(contentId)
    }
    return newLiked
  })
}

const renderContentCard = (content: ContentItem) => (
  <Card key={content.id}>
    <CardHeader>
      <CardTitle>{content.title}</CardTitle>
      <CardDescription>{content.description}</CardDescription>
    </CardHeader>
    <CardContent>
      <div className="flex items-center mt-4 text-sm text-muted-foreground">
        <Avatar className="h-6 w-6 mr-2">
          <AvatarImage src={content.author.avatar} alt={content.author.name} />
          <AvatarFallback>{content.author.name[0]}</AvatarFallback>
        </Avatar>
        <span>作者：{content.author.name}</span>
      </div>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button variant="outline" onClick={() => onViewContent(content.id)}>查看内容 (¥{content.price})</Button>
      <div className="flex space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => onNavigate('messaging', { userId: content.author.id, userName: content.author.name })}
        >
          <MessageCircle className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => handleLike(content.id)}
        >
          <Heart className={`h-4 w-4 ${likedContent.has(content.id) ? 'fill-red-500 text-red-500' : ''}`} />
        </Button>
      </div>
    </CardFooter>
  </Card>
)

return (
  <div className="w-full p-4">
    <Input 
      type="search" 
      placeholder="搜索想法或主题" 
      className="mb-4"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
    <Tabs defaultValue="discover" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="discover">发现</TabsTrigger>
        <TabsTrigger value="recommended">推荐</TabsTrigger>
      </TabsList>
      <TabsContent value="discover" className="space-y-4">
        {discoverContent.map(renderContentCard)}
      </TabsContent>
      <TabsContent value="recommended" className="space-y-4">
        {recommendedContent.map(renderContentCard)}
      </TabsContent>
    </Tabs>
  </div>
)
}

