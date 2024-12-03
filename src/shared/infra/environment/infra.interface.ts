export interface IDatabaseConfig {
  getDatabaseType(): string;
  getDatabaseHost(): string;
  getDatabasePort(): number;
  getDatabaseUser(): string;
  getDatabasePassword(): string;
  getDatabaseName(): string;
}

export interface IAppConfig {
  getAppURL(): string;
  getAppName(): string;
  getAppPort(): number;
}

export interface IJwtConfig {
  getAccessTokenSecret(): string;
  getAccessTokenExpireTime(): number;
  getRefreshTokenSecret(): string;
  getRefreshTokenExpireTime(): number;
}

export interface IRedisConfig {
  getRedisHost(): string;
  getRedisPort(): number;
  getRedisPassword(): string;
  getRedisURL(): string;
}

export interface IMailConfig {
  getMailHost(): string;
  getMailPort(): number;
  getMailUsername(): string;
  getMailPassword(): string;
  getMailFrom(): string;
  getMailURL(): string;
  getMailSecret(): string;
  getMailExpireTime(): number;
}

export interface ILangConfig {
  getFallbackLang(): string;
}

export interface IGroqConfig {
  getGroqApiKey(): string;
}

export interface IPaypalConfig {
  getPaypalClientId(): string;
  getPaypalSecretKey(): string;
  getPaypalURL(): string;
}

export interface IAwsConfig {
  getAwsAccessKeyId(): string;
  getAwsAcesssSecretKey(): string;
  getAwsBucketName(): string;
  getAwsRegion(): string;
}
