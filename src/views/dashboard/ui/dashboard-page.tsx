"use client";

import {
  Activity,
  BarChart3,
  Bell,
  DollarSign,
  Mail,
  Search,
  Settings,
  TrendingUp,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/shared/ui/avatar";
import { Badge } from "@/shared/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { DashboardLayout } from "@/shared/ui/dashboard-layout";
import { Separator } from "@/shared/ui/separator";

export function DashboardPage() {
  const stats = [
    {
      title: "Total Revenue",
      value: "$45,231.89",
      change: "+20.1%",
      icon: DollarSign,
      trend: "up",
    },
    {
      title: "Active Users",
      value: "2,350",
      change: "+180.1%",
      icon: Users,
      trend: "up",
    },
    {
      title: "Performance",
      value: "98.5%",
      change: "+5.2%",
      icon: Activity,
      trend: "up",
    },
    {
      title: "Growth Rate",
      value: "12.5%",
      change: "+2.4%",
      icon: TrendingUp,
      trend: "up",
    },
  ];

  const recentActivity = [
    {
      user: "Alice Johnson",
      action: "Created new project",
      time: "2 min ago",
      avatar: "/avatars/01.png",
    },
    {
      user: "Bob Smith",
      action: "Updated profile settings",
      time: "5 min ago",
      avatar: "/avatars/02.png",
    },
    {
      user: "Carol Davis",
      action: "Completed task #1234",
      time: "10 min ago",
      avatar: "/avatars/03.png",
    },
    {
      user: "David Wilson",
      action: "Left a comment",
      time: "15 min ago",
      avatar: "/avatars/04.png",
    },
  ];

  return (
    <DashboardLayout>
      <div className="p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back! Here&apos;s what&apos;s happening with your projects.
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search..."
                  className="h-9 w-64 rounded-md border border-input bg-background pl-10 pr-3 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                />
              </div>
              <button className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                <Bell className="h-4 w-4" />
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-md border border-input bg-background hover:bg-accent hover:text-accent-foreground">
                <Settings className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="relative overflow-hidden">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <Icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
                      <span className="text-emerald-500">{stat.change}</span>
                      <span className="ml-1">from last month</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-6 lg:grid-cols-7">
            {/* Chart Section */}
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Analytics Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-64 items-center justify-center rounded-md border border-dashed">
                  <div className="text-center">
                    <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Chart component would go here
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {activity.user
                          .split(" ")
                          .map(n => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {activity.user}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {activity.action}
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {activity.time}
                    </div>
                  </div>
                ))}
                <Separator className="my-4" />
                <div className="text-center">
                  <button className="text-sm text-primary hover:underline">
                    View all activity
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Bottom Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <button className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
                      <Users className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Invite Team Members</span>
                  </div>
                  <Badge variant="secondary">New</Badge>
                </button>
                <button className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                      <Mail className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Send Newsletter</span>
                  </div>
                </button>
                <button className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
                      <BarChart3 className="h-4 w-4" />
                    </div>
                    <span className="font-medium">Generate Report</span>
                  </div>
                </button>
              </CardContent>
            </Card>

            {/* Team Overview */}
            <Card>
              <CardHeader>
                <CardTitle>Team Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Total Members
                  </span>
                  <span className="font-semibold">24</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Active Today
                  </span>
                  <span className="font-semibold">18</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Projects
                  </span>
                  <span className="font-semibold">12</span>
                </div>
                <Separator />
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4, 5].map(i => (
                    <Avatar
                      key={i}
                      className="h-8 w-8 border-2 border-background">
                      <AvatarFallback className="text-xs">U{i}</AvatarFallback>
                    </Avatar>
                  ))}
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs">
                    +19
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
