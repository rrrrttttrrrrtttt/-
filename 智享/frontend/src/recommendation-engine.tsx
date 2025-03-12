import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Button } from "@/src/components/ui/button"

interface RecommendedContent {
  id: string;
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
  };
  price: number;
}

const recommendedContent: RecommendedContent[] = [
  {
    id: '1',
    title: 'Advanced React Patterns',
    description: 'Learn advanced React patterns to build scalable applications.',
    author: {
      name: 'Jane Doe',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    price: 29.99,
  },
  {
    id: '2',
    title: 'GraphQL Mastery',
    description: 'Master GraphQL and integrate it with your React applications.',
    author: {
      name: 'John Smith',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    price: 24.99,
  },
  {
    id: '3',
    title: 'State Management with Redux',
    description: 'Learn how to effectively manage state in large-scale applications.',
    author: {
      name: 'Alice Johnson',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    price: 19.99,
  },
]

interface RecommendationEngineProps {
  onViewContent: (id: string) => void;
}

export default function RecommendationEngine({ onViewContent }: RecommendationEngineProps) {
  return (
    <div className="max-w-4xl mx-auto p-4 bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-6">Recommended for You</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendedContent.map((content) => (
          <Card key={content.id}>
            <CardHeader>
              <CardTitle>{content.title}</CardTitle>
              <CardDescription>{content.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Avatar>
                  <AvatarImage src={content.author.avatar} alt={content.author.name} />
                  <AvatarFallback>{content.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{content.author.name}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span className="text-lg font-bold">${content.price.toFixed(2)}</span>
              <Button variant="outline" onClick={() => onViewContent(content.id)}>View Content</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

