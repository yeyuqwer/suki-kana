export const clientEnv = {
  environment: process.env.NEXT_PUBLIC_ENVIRONMENT as 'development' | 'production',
  appName: process.env.NEXT_PUBLIC_APP_NAME as string,
}
