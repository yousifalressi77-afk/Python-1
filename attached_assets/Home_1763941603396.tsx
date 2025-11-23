import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Shield, Users, Settings, Zap } from "lucide-react";
import { APP_LOGO, APP_BANNER, BOT_NAME, BOT_DEVELOPER, getLoginUrl } from "@/const";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated, loading } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-slate-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated && user) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img src={APP_LOGO} alt={BOT_NAME} className="w-10 h-10 rounded-lg" />
            <h1 className="text-xl font-bold text-white">{BOT_NAME}</h1>
          </div>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            تسجيل الدخول
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div>
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
                  لوحة تحكم <span className="text-blue-500">{BOT_NAME}</span>
                </h2>
                <p className="text-xl text-slate-400 mb-2">
                  إدارة خادمك بسهولة وكفاءة
                </p>
                <p className="text-sm text-slate-500">
                  من تطوير: <span className="text-blue-400">{BOT_DEVELOPER}</span>
                </p>
              </div>

              <p className="text-lg text-slate-300 leading-relaxed">
                لوحة تحكم احترافية وقوية لإدارة جميع جوانب البوت. تحكم في الإعدادات والمستخدمين والتذاكر من مكان واحد.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => (window.location.href = getLoginUrl())}
                  size="lg"
                  className="bg-blue-600 hover:bg-blue-700 text-white text-base py-6"
                >
                  ابدأ الآن
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-600 text-white hover:bg-slate-800 text-base py-6"
                >
                  تعرف على المزيد
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <div className="text-2xl font-bold text-blue-400">100+</div>
                  <div className="text-sm text-slate-400">خادم نشط</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <div className="text-2xl font-bold text-blue-400">10K+</div>
                  <div className="text-sm text-slate-400">مستخدم</div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
                  <div className="text-2xl font-bold text-blue-400">99.9%</div>
                  <div className="text-sm text-slate-400">الموثوقية</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 rounded-2xl blur-3xl"></div>
              <img
                src={APP_BANNER}
                alt="PrimeBot Banner"
                className="relative rounded-2xl shadow-2xl border border-slate-700 w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-4xl font-bold text-white mb-4">المميزات الرئيسية</h3>
            <p className="text-xl text-slate-400">كل ما تحتاجه لإدارة خادمك في مكان واحد</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 */}
            <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-colors">
              <CardHeader>
                <Shield className="w-8 h-8 text-blue-500 mb-2" />
                <CardTitle className="text-white">إدارة آمنة</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  تحكم آمن وموثوق في جميع إعدادات الخادم
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-colors">
              <CardHeader>
                <Users className="w-8 h-8 text-blue-500 mb-2" />
                <CardTitle className="text-white">إدارة المستخدمين</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  عرض وإدارة جميع مستخدمي الخادم بسهولة
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-colors">
              <CardHeader>
                <Settings className="w-8 h-8 text-blue-500 mb-2" />
                <CardTitle className="text-white">إعدادات متقدمة</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  تخصيص كامل لجميع ميزات البوت
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="bg-slate-800/50 border-slate-700 hover:border-blue-500/50 transition-colors">
              <CardHeader>
                <Zap className="w-8 h-8 text-blue-500 mb-2" />
                <CardTitle className="text-white">أداء عالي</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-400">
                  سرعة فائقة واستجابة فورية
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/30 rounded-2xl p-12">
            <h3 className="text-3xl font-bold text-white mb-4">جاهز للبدء؟</h3>
            <p className="text-lg text-slate-300 mb-8">
              سجل دخولك الآن عبر Discord وابدأ في إدارة خادمك
            </p>
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white text-base py-6 px-8"
            >
              تسجيل الدخول عبر Discord
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <img src={APP_LOGO} alt={BOT_NAME} className="w-6 h-6 rounded" />
              <span className="text-white font-semibold">{BOT_NAME}</span>
            </div>
            <div className="text-slate-400 text-sm">
              <p>تم التطوير بواسطة <span className="text-blue-400">{BOT_DEVELOPER}</span></p>
              <p className="mt-2">جميع الحقوق محفوظة © 2024</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
