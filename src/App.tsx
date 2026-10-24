import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { login } from "./features/auth/auth.api";
import type { LoginRequest } from "./features/auth/auth.types";
import { validateLogin } from "./features/auth/auth.validation";

const initialValues: LoginRequest = {
  email: "",
  password: "",
  rememberMe: false,
};

function App() {
  const { t, i18n } = useTranslation();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<
    { type: "success" | "error"; message: string } | undefined
  >();
  const [showPassword, setShowPassword] = useState(false);

  function updateField(field: keyof LoginRequest, value: string | boolean) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setFeedback(undefined);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateLogin(values, t);
    setErrors(nextErrors);
    setFeedback(undefined);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await login(values);
      setFeedback({ type: "success", message: t("success") });
    } catch {
      setFeedback({ type: "error", message: t("invalidCredentials") });
    } finally {
      setIsSubmitting(false);
    }
  }

  function toggleLanguage() {
    const nextLanguage = i18n.language === "vi" ? "en" : "vi";
    void i18n.changeLanguage(nextLanguage);
    localStorage.setItem("language", nextLanguage);
    document.documentElement.lang = nextLanguage;
  }

  return (
    <main className="auth-shell">
      <section className="brand-panel" aria-label={t("brand")}>
        <div className="brand-mark">FH</div>
        <div className="brand-copy">
          <p className="brand-name">{t("brand")}</p>
          <p className="brand-tagline">{t("tagline")}</p>
        </div>
        <div className="brand-note">
          <span>“</span>
          <p>Wear what feels like you.</p>
        </div>
      </section>

      <section className="form-panel">
        <button className="language-toggle" type="button" onClick={toggleLanguage}>
          <span aria-hidden="true">◎</span>
          {i18n.language === "vi" ? "EN" : "VI"}
          <span className="sr-only">{t("language")}</span>
        </button>

        <div className="form-content">
          <p className="eyebrow">{t("eyebrow")}</p>
          <h1>{t("title")}</h1>
          <p className="subtitle">{t("subtitle")}</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="field">
              <label htmlFor="email">{t("email")}</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder={t("emailPlaceholder")}
                value={values.email}
                onChange={(event) => updateField("email", event.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && <p className="field-error" id="email-error">{errors.email}</p>}
            </div>

            <div className="field">
              <div className="label-row">
                <label htmlFor="password">{t("password")}</label>
                <button className="text-button" type="button">
                  {t("forgot")}
                </button>
              </div>
              <div className="password-input">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder={t("passwordPlaceholder")}
                  value={values.password}
                  onChange={(event) => updateField("password", event.target.value)}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  className="password-toggle"
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  aria-label={showPassword ? t("hidePassword") : t("showPassword")}
                >
                  {showPassword ? "◉" : "◌"}
                </button>
              </div>
              {errors.password && <p className="field-error" id="password-error">{errors.password}</p>}
            </div>

            <label className="checkbox-row">
              <input
                type="checkbox"
                checked={values.rememberMe}
                onChange={(event) => updateField("rememberMe", event.target.checked)}
              />
              <span>{t("remember")}</span>
            </label>

            {feedback && (
              <p className={`feedback ${feedback.type}`} role="status">
                {feedback.message}
              </p>
            )}

            <button className="submit-button" type="submit" disabled={isSubmitting}>
              {isSubmitting ? t("loading") : t("submit")}
              {!isSubmitting && <span aria-hidden="true">→</span>}
            </button>
          </form>

          <p className="register-prompt">
            {t("noAccount")}{" "}
            <button className="text-button register-button" type="button">
              {t("register")}
            </button>
          </p>

          <aside className="demo-note">
            <strong>{t("demoTitle")}</strong>
            <span>{t("demoText")}</span>
          </aside>
        </div>
      </section>
    </main>
  );
}

export default App;
