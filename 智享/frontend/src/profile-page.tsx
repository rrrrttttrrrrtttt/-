import { ArrowLeft, Edit, Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs"
import { useState } from 'react';
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background text-foreground">
      <header className="flex items-center p-4 border-b">
        <Button variant="ghost" size="icon" className="mr-2">
          <ArrowLeft className="h-6 w-6" />
        </Button>
        <h1 className="text-2xl font-bold flex-1 text-center">Profile</h1>
        <Button variant="ghost" size="icon" onClick={() => setIsEditing(!isEditing)}>
          <Edit className="h-6 w-6" />
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col items-center mb-6">
          <Avatar className="w-24 h-24 mb-4">
            <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Jane Doe" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          {isEditing ? (
            <div className="space-y-2">
              <Input defaultValue="Jane Doe" placeholder="Name" />
              <Input defaultValue="Web Development Expert" placeholder="Title" />
              <Textarea defaultValue="I'm a passionate web developer with over 10 years of experience. I specialize in React and modern JavaScript frameworks." placeholder="About Me" />
              <Button onClick={() => setIsEditing(false)}>Save Changes</Button>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold">Jane Doe</h2>
              <p className="text-muted-foreground">Web Development Expert</p>
            </>
          )}
          <div className="flex items-center mt-2">
            <Star className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="font-semibold">4.8</span>
            <span className="text-muted-foreground ml-1">(124 reviews)</span>
          </div>
        </div>

        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="about">About</TabsTrigger>
          </TabsList>
          <TabsContent value="content" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>React Hooks Masterclass</CardTitle>
                <CardDescription>Advanced tutorial on React Hooks</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Learn how to leverage the power of React Hooks in your projects.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Content ($15)</Button>
              </CardFooter>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>State Management with Redux</CardTitle>
                <CardDescription>Comprehensive guide to Redux</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Master state management in large-scale React applications with Redux.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Content ($20)</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="about" className="space-y-4">
            <h3 className="text-lg font-semibold">About Me</h3>
            <p>I'm a passionate web developer with over 10 years of experience. I specialize in React and modern JavaScript frameworks. My goal is to help aspiring developers master the art of front-end development.</p>
            <h3 className="text-lg font-semibold">Expertise</h3>
            <ul className="list-disc list-inside">
              <li>React.js</li>
              <li>JavaScript (ES6+)</li>
              <li>State Management (Redux, MobX)</li>
              <li>GraphQL</li>
              <li>Node.js</li>
            </ul>
          </TabsContent>
        </Tabs>
        <div className="mt-6 space-y-2">
          <Button className="w-full" variant="outline" onClick={() => onNavigate('settings')}>
            User Settings
          </Button>
          <Button className="w-full" variant="outline" onClick={() => onNavigate('analytics')}>
            Creator Analytics
          </Button>
        </div>
      </main>
    </div>
  )
}

