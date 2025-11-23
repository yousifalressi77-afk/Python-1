import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Search } from "lucide-react";
import { useLocation } from "wouter";
import { APP_LOGO, BOT_NAME } from "@/const";
import { useState } from "react";

export default function Users() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  if (!user) {
    navigate("/");
    return null;
  }

  // Mock data
  const users = [
    {
      id: "1",
      username: "مستخدم 1",
      avatar: "👤",
      level: 5,
      xp: 1250,
      joinDate: "2024-01-15",
    },
    {
      id: "2",
      username: "مستخدم 2",
      avatar: "👤",
      level: 3,
      xp: 750,
      joinDate: "2024-02-20",
    },
  ];

  const filteredUsers = users.filter((u) =>
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">المستخدمون</h2>
          <p className="text-slate-400">إدارة مستخدمي الخادم</p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute right-3 top-3 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="ابحث عن مستخدم..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 pr-10 pl-4 text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Users Table */}
        <Card className="bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">قائمة المستخدمين</CardTitle>
            <CardDescription className="text-slate-400">
              عدد المستخدمين: {filteredUsers.length}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredUsers.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-700">
                      <th className="text-right py-3 px-4 text-slate-400 font-semibold">
                        المستخدم
                      </th>
                      <th className="text-right py-3 px-4 text-slate-400 font-semibold">
                        المستوى
                      </th>
                      <th className="text-right py-3 px-4 text-slate-400 font-semibold">
                        النقاط
                      </th>
                      <th className="text-right py-3 px-4 text-slate-400 font-semibold">
                        تاريخ الانضمام
                      </th>
                      <th className="text-right py-3 px-4 text-slate-400 font-semibold">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b border-slate-700 hover:bg-slate-700/30 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{u.avatar}</span>
                            <span className="text-white">{u.username}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="bg-blue-600/20 text-blue-400 px-3 py-1 rounded-full text-sm">
                            المستوى {u.level}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-slate-300">{u.xp} XP</td>
                        <td className="py-4 px-4 text-slate-400">{u.joinDate}</td>
                        <td className="py-4 px-4">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-slate-600 text-slate-300 hover:bg-slate-700"
                          >
                            عرض
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400">لا توجد نتائج</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
