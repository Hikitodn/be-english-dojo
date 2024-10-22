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
