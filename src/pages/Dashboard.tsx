
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { stats, posts } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { FileText, BookOpen, Edit2, Users, Eye, Calendar } from "lucide-react";

export default function Dashboard() {
  // Format data for charts
  const viewsData = posts
    .filter(post => post.status === 'published')
    .map(post => ({
      name: post.title.length > 20 ? post.title.substring(0, 20) + '...' : post.title,
      views: post.views
    }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Last updated:</span>
          <span className="text-sm font-medium">April 21, 2023</span>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Posts</CardTitle>
                <FileText className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalPosts}</div>
                <p className="text-xs text-muted-foreground">
                  +2.5% from last month
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Published</CardTitle>
                <BookOpen className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.publishedPosts}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.publishedPosts / stats.totalPosts) * 100)}% of total posts
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Drafts</CardTitle>
                <Edit2 className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.draftPosts}</div>
                <p className="text-xs text-muted-foreground">
                  {Math.round((stats.draftPosts / stats.totalPosts) * 100)}% of total posts
                </p>
              </CardContent>
            </Card>
            
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  +12.4% from last month
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4 hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Post Views</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={viewsData}>
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip 
                        contentStyle={{ 
                          background: 'white', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '0.375rem',
                          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                        }} 
                      />
                      <Bar dataKey="views" fill="#9b87f5" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-3 hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>
                  Your latest blog activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-center gap-4 text-sm">
                      <div className={`p-2 rounded-full ${
                        activity.action === 'Published' 
                          ? 'bg-green-100 text-green-600' 
                          : activity.action === 'Edited'
                          ? 'bg-blue-100 text-blue-600'
                          : activity.action === 'Created'
                          ? 'bg-purple-100 text-purple-600'
                          : 'bg-orange-100 text-orange-600'
                      }`}>
                        {activity.action === 'Published' && <BookOpen className="h-4 w-4" />}
                        {activity.action === 'Edited' && <Edit2 className="h-4 w-4" />}
                        {activity.action === 'Created' && <FileText className="h-4 w-4" />}
                        {activity.action === 'Archived' && <Calendar className="h-4 w-4" />}
                      </div>
                      <div className="flex-1 space-y-1">
                        <p className="font-medium leading-none">{activity.action} <span className="font-normal">{activity.item}</span></p>
                        <p className="text-xs text-muted-foreground">{activity.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="analytics" className="p-8 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium">Analytics Dashboard</h3>
            <p className="text-muted-foreground">Analytics features coming soon!</p>
          </div>
        </TabsContent>
        
        <TabsContent value="reports" className="p-8 flex items-center justify-center">
          <div className="text-center">
            <h3 className="text-lg font-medium">Reports Dashboard</h3>
            <p className="text-muted-foreground">Report features coming soon!</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
