import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { getQuizDetail, submitQuiz, getMySubmission } from "@/service/quizService";
import { toast } from "sonner";
import { Clock, CheckCircle, ArrowLeft } from "lucide-react";

const StudentQuizPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(null);

  // Fetch quiz details
  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ["quiz", quizId],
    queryFn: () => getQuizDetail(quizId),
    enabled: !!quizId,
  });

  // Check if already submitted
  const { data: submission } = useQuery({
    queryKey: ["my-submission", quizId],
    queryFn: () => getMySubmission(quizId),
    enabled: !!quizId,
  });

  // Submit quiz mutation
  const { mutateAsync: submitQuizAsync, isPending: isSubmitting } = useMutation({
    mutationFn: (answers) => submitQuiz(quizId, answers),
    onSuccess: (data) => {
      toast.success(`Quiz submitted! Score: ${data.submission.score}/${quiz.questions.length}`);
      navigate(-1);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to submit quiz");
    },
  });

  // Timer (optional - 30 minutes)
  useEffect(() => {
    if (quiz && !submission) {
      setTimeLeft(30 * 60); // 30 minutes in seconds
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quiz, submission]);

  const handleAnswerChange = (questionIndex, selectedOption) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: selectedOption
    }));
  };

  const handleSubmit = async () => {
    if (!quiz) return;

    // Convert answers to required format
    const formattedAnswers = quiz.questions.map((_, index) => ({
      questionIndex: index,
      selected: answers[index] || 0
    }));

    await submitQuizAsync(formattedAnswers);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = quiz ? ((currentQuestion + 1) / quiz.questions.length) * 100 : 0;

  if (quizLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-lg">Loading quiz...</div>
      </div>
    );
  }

  if (submission) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle>Quiz Already Completed</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl font-bold text-green-600">
              {submission.score}/{quiz.questions.length}
            </div>
            <p className="text-gray-600">
              You scored {Math.round((submission.score / quiz.questions.length) * 100)}%
            </p>
            <Button onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Course
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">Quiz not found</p>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">{quiz.title}</h1>
          {timeLeft !== null && (
            <div className="flex items-center gap-2 text-orange-600">
              <Clock className="h-4 w-4" />
              <span className="font-mono">{formatTime(timeLeft)}</span>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Question {currentQuestion + 1} of {quiz.questions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">
            {currentQ.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={answers[currentQuestion]?.toString() || ""}
            onValueChange={(value) => handleAnswerChange(currentQuestion, parseInt(value))}
          >
            {currentQ.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>

        <div className="flex gap-2">
          {currentQuestion < quiz.questions.length - 1 ? (
            <Button
              onClick={() => setCurrentQuestion(currentQuestion + 1)}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          )}
        </div>
      </div>

      {/* Question Navigation */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-base">Question Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-2">
            {quiz.questions.map((_, index) => (
              <Button
                key={index}
                variant={currentQuestion === index ? "default" : answers[index] !== undefined ? "secondary" : "outline"}
                size="sm"
                onClick={() => setCurrentQuestion(index)}
                className="w-8 h-8 p-0"
              >
                {index + 1}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentQuizPage;
