import { useState } from 'react'
import { Button } from "@/src/components/ui/button"
import { Input } from "@/src/components/ui/input"
import { Label } from "@/src/components/ui/label"
import { Textarea } from "@/src/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/src/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Upload, X, ImageIcon, Video } from 'lucide-react'

export default function CreateContentPage() {
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImages([...images, ...Array.from(event.target.files)]);
    }
  };

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setVideos([...videos, ...Array.from(event.target.files)]);
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">创建内容</h2>
      <form className="space-y-4">
        <div>
          <Label htmlFor="title">标题</Label>
          <Input id="title" placeholder="输入您的内容标题" />
        </div>
        <div>
          <Label htmlFor="description">描述</Label>
          <Textarea id="description" placeholder="提供您内容的简短描述" />
        </div>
        <div>
          <Label htmlFor="category">类别</Label>
          <Select>
            <SelectTrigger id="category">
              <SelectValue placeholder="选择一个类别" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="webdev">Web 开发</SelectItem>
              <SelectItem value="mobile">移动开发</SelectItem>
              <SelectItem value="design">设计</SelectItem>
              <SelectItem value="business">商业</SelectItem>
              <SelectItem value="marketing">营销</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="price">价格 (¥)</Label>
          <Input id="price" type="number" min="0" step="0.01" placeholder="设置您的内容价格" />
        </div>
        <div>
          <Label htmlFor="content">内容</Label>
          <Textarea id="content" placeholder="在这里写下您的内容或提供内容链接" rows={6} />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>上传图片</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center w-full">
              <Label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">点击上传图片</span> 或拖放</p>
                </div>
                <Input id="image-upload" type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
              </Label>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img src={URL.createObjectURL(image)} alt={`Uploaded ${index + 1}`} className="w-full h-32 object-cover rounded-lg" />
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-1 right-1" 
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>上传视频</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center w-full">
              <Label htmlFor="video-upload" className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-2 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">点击上传视频</span> 或拖放</p>
                </div>
                <Input id="video-upload" type="file" accept="video/*" multiple className="hidden" onChange={handleVideoUpload} />
              </Label>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              {videos.map((video, index) => (
                <div key={index} className="relative">
                  <video src={URL.createObjectURL(video)} className="w-full h-32 object-cover rounded-lg" />
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-1 right-1" 
                    onClick={() => removeVideo(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Button type="submit" className="w-full">发布内容</Button>
      </form>
    </div>
  )
}

