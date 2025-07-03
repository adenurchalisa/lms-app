import { Link } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";

export const CardContentCourse = ({
  id,
  title,
  description,
  isPending,
  onHandleDelete,
}) => {
  return (
    <div
      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
      key={id}
    >
      <div className="flex gap-4 items-center">
        <Avatar className="h-20 w-20 rounded-lg">
          <AvatarImage src="" alt="" />
          <AvatarFallback className="rounded-lg">US</AvatarFallback>
        </Avatar>
        <div>
          <h1>{title}</h1>
          <p>{description}</p>
        </div>
      </div>
      <div className="space-x-2">
        <Button
          variant="destructive"
          size="lg"
          disabled={isPending}
          onClick={() => onHandleDelete(id)}
        >
          {isPending ? "Memuat..." : "Hapus"}
        </Button>
        <Link to={`/dashboard/courses/${id}/detail`}>
          <Button variant="outline" size="lg">
            Edit
          </Button>
        </Link>
      </div>
    </div>
  );
};
