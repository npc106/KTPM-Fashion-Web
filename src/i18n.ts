import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  vi: {
    translation: {
      brand: "FASHION HOUSE",
      tagline: "Phong cách của riêng bạn",
      eyebrow: "Chào mừng trở lại",
      title: "Đăng nhập tài khoản",
      subtitle: "Đăng nhập để tiếp tục mua sắm và theo dõi đơn hàng.",
      email: "Email",
      emailPlaceholder: "you@example.com",
      password: "Mật khẩu",
      passwordPlaceholder: "Nhập mật khẩu",
      remember: "Ghi nhớ đăng nhập",
      forgot: "Quên mật khẩu?",
      submit: "Đăng nhập",
      loading: "Đang xác thực...",
      noAccount: "Chưa có tài khoản?",
      register: "Đăng ký ngay",
      demoTitle: "Chế độ giao diện mẫu",
      demoText: "Chưa kết nối backend. Dùng demo@example.com / password123 để xem luồng thành công.",
      invalidEmail: "Vui lòng nhập email hợp lệ.",
      requiredPassword: "Vui lòng nhập mật khẩu.",
      invalidCredentials: "Email hoặc mật khẩu không đúng.",
      success: "Đăng nhập thành công. Sẵn sàng chuyển đến trang chính.",
      networkError: "Không thể kết nối máy chủ. Vui lòng thử lại.",
      hidePassword: "Ẩn mật khẩu",
      showPassword: "Hiện mật khẩu",
      language: "Ngôn ngữ",
    },
  },
  en: {
    translation: {
      brand: "FASHION HOUSE",
      tagline: "Your style, your story",
      eyebrow: "Welcome back",
      title: "Sign in to your account",
      subtitle: "Sign in to continue shopping and tracking your orders.",
      email: "Email",
      emailPlaceholder: "you@example.com",
      password: "Password",
      passwordPlaceholder: "Enter your password",
      remember: "Remember me",
      forgot: "Forgot password?",
      submit: "Sign in",
      loading: "Signing in...",
      noAccount: "Don't have an account?",
      register: "Create one",
      demoTitle: "UI preview mode",
      demoText: "Backend is not connected yet. Use demo@example.com / password123 to preview success.",
      invalidEmail: "Please enter a valid email.",
      requiredPassword: "Please enter your password.",
      invalidCredentials: "Email or password is incorrect.",
      success: "Signed in successfully. Ready to open the home page.",
      networkError: "Unable to reach the server. Please try again.",
      hidePassword: "Hide password",
      showPassword: "Show password",
      language: "Language",
    },
  },
} as const;

void i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") ?? "vi",
  fallbackLng: "vi",
  supportedLngs: ["vi", "en"],
  interpolation: { escapeValue: false },
});

export default i18n;
