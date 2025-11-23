import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus, Settings, Trash2 } from "lucide-react";
import { useLocation } from "wouter";
import { APP_LOGO, BOT_NAME } from "@/const";

export default function Servers() {
  const { user } = useAuth();
  const [, navigate] = useLocation();

  if (!user) {
    navigate("/");
    return null;
  }

  // Mock data - في الواقع ستأتي من البوت
  const servers = [
    {
      id: "1",
      name: "خادم اختبار",
      icon: "🎮",
      members: 150,
      prefix: "!",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt={BOT_NAME} className="w-10 h-10 rounded-lg" />
            <h1 className="text-xl font-bold text-white">{BOT_NAME} Dashboard</h1>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="border-slate-600 text-slate-300 hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4 ml-2" />
            العودة
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">إدارة الخوادم</h2>
            <p className="text-slate-400">إدارة جميع خوادمك وإعداداتها</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
            <Plus className="w-4 h-4 ml-2" />
            إضافة خادم
          </Button>
        </div>

        {/* Servers Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers.length > 0 ? (
            servers.map((server) => (
              <Card
                key={server.id}
                className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{server.icon}</div>
                      <div>
                        <CardTitle className="text-white">{server.name}</CardTitle>
                        <CardDescription className="text-slate-400">
                          {server.members} عضو
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-slate-900/50 rounded-lg p-3">
                    <p className="text-sm text-slate-400 mb-1">البادئة</p>
                    <p className="text-white font-mono">{server.prefix}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                    >
                      <Settings className="w-4 h-4 ml-2" />
                      الإعدادات
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-red-600/30 text-red-400 hover:bg-red-600/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="bg-slate-800/50 border-slate-700 md:col-span-2 lg:col-span-3">
              <CardContent className="py-12 text-center">
                <p className="text-slate-400 mb-4">لا توجد خوادم متصلة</p>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة خادم الآن
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
