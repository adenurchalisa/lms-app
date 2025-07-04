import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { getMySubmission } from "@/service/quizService";
import { Brain, CheckCircle, Clock, Play } from "lucide-react";
import { Link } from "react-router";

export const QuizCard = ({ quiz }) => {
  // Check if student has submitted this quiz
  const { data: submission } = useQuery({
    queryKey: ["my-submission", quiz._id],
    queryFn: () => getMySubmission(quiz._id),
    enabled: !!quiz._id,
    retry: false, // Don't retry if no submission found
  });

  const isCompleted = !!submission;
  const score = submission ? `${submission.score}/${quiz.questions?.length || 0}` : null;
  const percentage = submission ? Math.round((submission.score / (quiz.questions?.length || 1)) * 100) : null;

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isCompleted ? 'bg-green-100' : 'bg-blue-100'
        }`}>
          {isCompleted ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <Brain className="h-5 w-5 text-blue-600" />
          )}
        </div>
        <div>
          <h3 className="font-medium">{quiz.title}</h3>
          <p className="text-sm text-gray-600">
            {quiz.description || "No description"}
          </p>
          <p className="text-xs text-gray-500">
            {quiz.questions?.length || 0} questions
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {isCompleted && (
          <div className="text-right">
            <div className={`text-sm font-medium ${
              percentage >= 70 ? 'text-green-600' : percentage >= 50 ? 'text-orange-600' : 'text-red-600'
            }`}>
              Score: {score} ({percentage}%)
            </div>
            <div className="text-xs text-gray-500">Completed</div>
          </div>
        )}
        
        {isCompleted ? (
          <Button variant="outline" size="sm" disabled>
            <CheckCircle className="h-4 w-4 mr-2" />
            Completed
          </Button>
        ) : (
          <Link to={`/quiz/${quiz._id}`}>
            <Button size="sm">
              <Play className="h-4 w-4 mr-2" />
              Start Quiz
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
