type PublicEnv = {
  NEXT_PUBLIC_APP_URL: string;
  SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string;
};

type ServerEnv = {
  DATABASE_URL?: string;
  DIRECT_URL?: string;
  APP_SECRET?: string;
  CRON_SECRET?: string;
  ADMIN_EMAIL?: string;
  ADMIN_BASIC_USER?: string;
  ADMIN_BASIC_PASSWORD?: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SUPABASE_STORAGE_BUCKET?: string;
  SUPABASE_ARTWORK_BUCKET?: string;
  RESEND_API_KEY?: string;
  EMAIL_FROM?: string;
  EMAIL_REPLY_TO?: string;
  ADMIN_NOTIFY_EMAIL?: string;
  ENABLE_REORDER_REMINDERS?: string;
  TELEGRAM_BOT_TOKEN?: string;
  TELEGRAM_OPERATOR_CHAT_ID?: string;
  CHAT_WEBHOOK_SECRET?: string;
};

function normalize(value?: string) {
  if (!value) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export function getPublicEnv(): PublicEnv {
  return {
    NEXT_PUBLIC_APP_URL:
      normalize(process.env.NEXT_PUBLIC_APP_URL) ?? "https://labelpilot.de",
    SUPABASE_URL: normalize(process.env.SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_URL:
      normalize(process.env.NEXT_PUBLIC_SUPABASE_URL) ??
      normalize(process.env.SUPABASE_URL),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: normalize(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
  };
}

export function getServerEnv(): ServerEnv {
  return {
    DATABASE_URL: normalize(process.env.DATABASE_URL),
    DIRECT_URL: normalize(process.env.DIRECT_URL),
    APP_SECRET: normalize(process.env.APP_SECRET),
    CRON_SECRET: normalize(process.env.CRON_SECRET),
    ADMIN_EMAIL: normalize(process.env.ADMIN_EMAIL),
    ADMIN_BASIC_USER: normalize(process.env.ADMIN_BASIC_USER),
    ADMIN_BASIC_PASSWORD: normalize(process.env.ADMIN_BASIC_PASSWORD),
    SUPABASE_SERVICE_ROLE_KEY: normalize(process.env.SUPABASE_SERVICE_ROLE_KEY),
    SUPABASE_STORAGE_BUCKET: normalize(process.env.SUPABASE_STORAGE_BUCKET),
    SUPABASE_ARTWORK_BUCKET: normalize(process.env.SUPABASE_ARTWORK_BUCKET),
    RESEND_API_KEY: normalize(process.env.RESEND_API_KEY),
    EMAIL_FROM: normalize(process.env.EMAIL_FROM),
    EMAIL_REPLY_TO: normalize(process.env.EMAIL_REPLY_TO),
    ADMIN_NOTIFY_EMAIL: normalize(process.env.ADMIN_NOTIFY_EMAIL),
    ENABLE_REORDER_REMINDERS: normalize(process.env.ENABLE_REORDER_REMINDERS),
    TELEGRAM_BOT_TOKEN: normalize(process.env.TELEGRAM_BOT_TOKEN),
    TELEGRAM_OPERATOR_CHAT_ID: normalize(process.env.TELEGRAM_OPERATOR_CHAT_ID),
    CHAT_WEBHOOK_SECRET: normalize(process.env.CHAT_WEBHOOK_SECRET),
  };
}

export function hasDatabaseEnv() {
  const env = getServerEnv();
  return Boolean(env.DATABASE_URL && env.DIRECT_URL);
}

export function hasSupabasePublicEnv() {
  const env = getPublicEnv();
  return Boolean(env.NEXT_PUBLIC_SUPABASE_URL && env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export function hasSupabaseServerEnv() {
  const publicEnv = getPublicEnv();
  const serverEnv = getServerEnv();
  return Boolean(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL &&
      serverEnv.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function hasResendEnv() {
  const env = getServerEnv();
  return Boolean(env.RESEND_API_KEY && env.EMAIL_FROM && env.EMAIL_REPLY_TO);
}

export function isReorderReminderEnabled() {
  return getServerEnv().ENABLE_REORDER_REMINDERS === "true";
}
