import { useState } from 'react'
import { Star } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar"
import { Button } from "@/src/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Textarea } from "@/src/components/ui/textarea"

interface Review {
id: number;
user: string;
avatar: string;
rating: number;
content: string;
date: string;
}

export default function ReviewRating() {
const [reviews, setReviews] = useState<Review[]>([
  { id: 1, user: '张三', avatar: '/placeholder.svg?height=40&width=40', rating: 5, content: '非常棒的教程！解释清晰简洁。', date: '2023-06-15' },
  { id: 2, user: '李四', avatar: '/placeholder.svg?height=40&width=40', rating: 4, content: '内容很有帮助。可以再多一些例子，但总体很棒！', date: '2023-06-14' },
]);
const [newReview, setNewReview] = useState({ rating: 0, content: '' });

const handleRatingChange = (rating: number) => {
  setNewReview({ ...newReview, rating });
};

const handleReviewSubmit = () => {
  if (newReview.rating > 0 && newReview.content.trim()) {
    setReviews([...reviews, {
      id: reviews.length + 1,
      user: '您',
      avatar: '/placeholder.svg?height=40&width=40',
      rating: newReview.rating,
      content: newReview.content.trim(),
      date: new Date().toISOString().split('T')[0]
    }]);
    setNewReview({ rating: 0, content: '' });
  }
};

return (
  <div className="p-4 bg-background text-foreground">
    <h2 className="text-2xl font-bold mb-4">评价与评分</h2>
    
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>写评价</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Button
              key={star}
              variant="ghost"
              size="sm"
              onClick={() => handleRatingChange(star)}
            >
              <Star className={`h-6 w-6 ${newReview.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
            </Button>
          ))}
        </div>
        <Textarea
          placeholder="在这里写下您的评价..."
          value={newReview.content}
          onChange={(e) => setNewReview({ ...newReview, content: e.target.value })}
          className="mb-2"
        />
        <Button onClick={handleReviewSubmit}>提交评价</Button>
      </CardContent>
    </Card>

    {reviews.map((review) => (
      <Card key={review.id} className="mb-4">
        <CardHeader>
          <div className="flex items-center">
            <Avatar className="w-10 h-10 mr-3">
              <AvatarImage src={review.avatar} alt={review.user} />
              <AvatarFallback>{review.user.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">{review.user}</CardTitle>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`h-4 w-4 ${review.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm mb-2">{review.content}</p>
          <p className="text-xs text-muted-foreground">{review.date}</p>
        </CardContent>
      </Card>
    ))}
  </div>
)
}

