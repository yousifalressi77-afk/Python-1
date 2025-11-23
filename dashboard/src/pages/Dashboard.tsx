import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, Settings, Users, Ticket, Server, BarChart3 } from "lucide-react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { APP_LOGO, BOT_NAME } from "@/const";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [, navigate] = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt={BOT_NAME} className="w-10 h-10 rounded-lg" />
            <h1 className="text-xl font-bold text-white">{BOT_NAME} Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white font-semibold">{user.name}</p>
              <p className="text-sm text-slate-400">{user.email}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              <LogOut className="w-4 h-4 ml-2" />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-2">أهلاً وسهلاً، {user.name}!</h2>
          <p className="text-slate-400">إدارة خادمك وإعدادات البوت من هنا</p>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">الخوادم النشطة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">0</div>
              <p className="text-xs text-slate-500 mt-1">خادم متصل</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">إجمالي المستخدمين</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">0</div>
              <p className="text-xs text-slate-500 mt-1">مستخدم مسجل</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">التذاكر المفتوحة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">0</div>
              <p className="text-xs text-slate-500 mt-1">تذكرة قيد الانتظار</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-400">الحالة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-white font-semibold">نشط</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">البوت يعمل بشكل طبيعي</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Servers Management */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-colors cursor-pointer group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">إدارة الخوادم</CardTitle>
                <Server className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
              </div>
              <CardDescription className="text-slate-400">
                إدارة إعدادات الخوادم المختلفة
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => navigate("/servers")}
              >
                الذهاب إلى الخوادم
              </Button>
            </CardContent>
          </Card>

          {/* Users Management */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-colors cursor-pointer group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">المستخدمون</CardTitle>
                <Users className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
              </div>
              <CardDescription className="text-slate-400">
                عرض وإدارة المستخدمين
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => navigate("/users")}
              >
                عرض المستخدمين
              </Button>
            </CardContent>
          </Card>

          {/* Tickets Management */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-colors cursor-pointer group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">التذاكر</CardTitle>
                <Ticket className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
              </div>
              <CardDescription className="text-slate-400">
                إدارة التذاكر والطلبات
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => navigate("/tickets")}
              >
                عرض التذاكر
              </Button>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-colors cursor-pointer group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">الإعدادات</CardTitle>
                <Settings className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
              </div>
              <CardDescription className="text-slate-400">
                إعدادات البوت والحساب
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => navigate("/settings")}
              >
                الذهاب للإعدادات
              </Button>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-colors cursor-pointer group">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">الإحصائيات</CardTitle>
                <BarChart3 className="w-5 h-5 text-blue-500 group-hover:scale-110 transition-transform" />
              </div>
              <CardDescription className="text-slate-400">
                عرض الإحصائيات والتقارير
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => navigate("/stats")}
              >
                عرض الإحصائيات
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-12">
          <Card className="bg-slate-800/50 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">النشاطات الأخيرة</CardTitle>
              <CardDescription className="text-slate-400">
                آخر الأنشطة على الخادم
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <p className="text-slate-400">لا توجد أنشطة حالياً</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
