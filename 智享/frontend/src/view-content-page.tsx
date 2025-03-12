import { useState } from 'react'
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/src/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { MessageCircle, Share2, ChevronLeft, ChevronRight } from 'lucide-react'
import SharePopup from './share-popup'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/src/components/ui/carousel"

interface ViewContentPageProps {
  contentId: string | null;
  onPurchase: () => void;
  onNavigate: (page: string, params?: any) => void;
}

export default function ViewContentPage({ contentId, onPurchase, onNavigate }: ViewContentPageProps) {
  const [shareOpen, setShareOpen] = useState(false);

  const content = {
    title: contentId ? `内容 ${contentId}` : "掌握 React Hooks：全面指南",
    description: "学习如何在项目中充分利用 React Hooks 的力量",
    author: {
      name: "张三",
      role: "Web 开发专家",
      avatar: "/placeholder.svg?height=50&width=50",
      id: '123'
    },
    price: 49.99,
    duration: "6 小时",
    difficulty: "中级到高级",
    lastUpdated: "2023年7月",
    includes: "4 个编码练习，2 个小项目",
    images: [
      "/placeholder.svg?height=400&width=600&text=React+Hooks+图解",
      "/placeholder.svg?height=400&width=600&text=使用场景示例",
    ],
    videos: [
      {
        url: "https://example.com/video1.mp4",
        thumbnail: "/placeholder.svg?height=400&width=600&text=视频预览1",
      },
      {
        url: "https://example.com/video2.mp4",
        thumbnail: "/placeholder.svg?height=400&width=600&text=视频预览2",
      },
    ],
  }

  const handleChatClick = () => {
    if (content.author) {
      onNavigate('messaging', { userId: content.author.id, userName: content.author.name });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{content.title}</CardTitle>
          <CardDescription className="text-xl">{content.description}</CardDescription>
          <div className="flex items-center mt-4">
            <Avatar className="h-12 w-12 mr-4">
              <AvatarImage src={content.author.avatar} alt={content.author.name} />
              <AvatarFallback>{content.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-lg font-medium">作者：{content.author.name}</p>
              <p className="text-sm text-muted-foreground">{content.author.role}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-muted p-4 rounded-md">
            <h4 className="font-semibold mb-2 text-lg">课程详情：</h4>
            <p>时长：{content.duration}</p>
            <p>难度：{content.difficulty}</p>
            <p>最后更新：{content.lastUpdated}</p>
            <p>包含：{content.includes}</p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4">课程内容预览</h3>
            <Carousel className="w-full max-w-xl mx-auto">
              <CarouselContent>
                {content.images.map((image, index) => (
                  <CarouselItem key={`image-${index}`}>
                    <img src={image} alt={`课程图片 ${index + 1}`} className="w-full h-64 object-cover rounded-md" />
                  </CarouselItem>
                ))}
                {content.videos.map((video, index) => (
                  <CarouselItem key={`video-${index}`}>
                    <div className="relative w-full h-64">
                      <img src={video.thumbnail} alt={`视频预览 ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Button variant="secondary" size="icon" className="rounded-full">
                          <ChevronRight className="h-6 w-6" />
                        </Button>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4">您将学到：</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>深入理解 useState 和 useEffect 钩子</li>
              <li>创建和优化自定义钩子以实现可重用逻辑</li>
              <li>使用 useReducer 管理复杂状态</li>
              <li>使用 useMemo 和 useCallback 优化性能</li>
              <li>使用 useLayoutEffect 处理副作用</li>
              <li>最佳实践和常见陷阱的避免</li>
            </ul>
          </div>

          <p className="text-lg">
            深入探索 React Hooks 的世界，将您的 React 技能提升到新的水平。 
            这个全面的指南涵盖了从基本钩子到高级模式和最佳实践的所有内容。
          </p>
        </CardContent>
        <CardFooter className="flex justify-between items-center">
          <Button onClick={onPurchase} size="lg">立即购买 (¥{content.price.toFixed(2)})</Button>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={handleChatClick}>
              <MessageCircle className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => setShareOpen(true)}>
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </CardFooter>
      </Card>
      <SharePopup 
        contentTitle={content.title}
        open={shareOpen}
        onOpenChange={setShareOpen}
      />
    </div>
  )
}

