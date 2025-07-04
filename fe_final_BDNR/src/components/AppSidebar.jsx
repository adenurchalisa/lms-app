import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "./ui/sidebar";
import { Command, LayoutDashboard, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router";
import { authLogout } from "@/service/authService";
import { getSession } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { getCourseStudent } from "@/service/studentService";

export const AppSidebar = () => {
  const session = getSession();
  const userRole = session?.role;

  console.log("AppSidebar - Session:", session);
  console.log("AppSidebar - User role:", userRole);

  const { data, isLoading, error } = useQuery({
    queryKey: ["listCourse"],
    queryFn: getCourseStudent,
    enabled: userRole === "student", // Only fetch for students
    staleTime: 0, // Always refetch
    cacheTime: 0, // Don't cache
    retry: 1, // Only retry once
  });

  console.log("AppSidebar - Query state:", { data, isLoading, error });

  const handleLogout = () => {
    authLogout();
  };

  return (
    <Sidebar collapsible="offcanvas" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">E-Learning</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {userRole === "teacher" && (
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>
                <Link
                  to={"/dashboard/teacher"}
                  className="flex items-center gap-2"
                >
                  <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                  Dashboard
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton>
                <Link
                  to="/dashboard/teacher/courses"
                  className="flex items-center gap-2"
                >
                  Manage Course
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        )}
        {userRole === "student" && (
          <>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Link
                    to={"/dashboard/student"}
                    className="flex items-center gap-2"
                  >
                    <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Link
                    to="/dashboard/student/courses"
                    className="flex items-center gap-2"
                  >
                    Jelajahi Course
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <Link
                    to="/dashboard/student/profile"
                    className="flex items-center gap-2"
                  >
                    Profile
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarGroup>
              <SidebarGroupLabel>My Course</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {isLoading ? (
                    <p className="text-sm text-gray-500 px-2">Loading courses...</p>
                  ) : error ? (
                    <div className="px-2">
                      <p className="text-sm text-red-500">Error loading courses</p>
                      <p className="text-xs text-gray-400">{error?.message || "Unknown error"}</p>
                    </div>
                  ) : data?.courses?.length > 0 ? (
                    data.courses.map((course) => {
                      return (
                        <SidebarMenuItem key={course._id}>
                          <SidebarMenuButton>
                            <Link
                              to={`/dashboard/student/${course._id}/detail`}
                            >
                              {course.title}
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })
                  ) : (
                    <p className="text-sm text-gray-500 px-2">Belum ada course yang diikuti</p>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              onClick={handleLogout}
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src="" alt="" />
                <AvatarFallback className="rounded-lg">
                  {session?.email?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {session?.email?.split("@")[0] || "User"}
                </span>
                <span className="truncate text-xs">
                  {session?.email || "No email"}
                </span>
              </div>
              <LogOut className="ml-auto size-4" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
