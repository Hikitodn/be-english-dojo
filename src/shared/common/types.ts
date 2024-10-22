import type { ColumnType } from "kysely";
export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>;
export type Timestamp = ColumnType<Date, Date | string, Date | string>;

export const Role = {
    STUDENT: "STUDENT",
    TEACHER: "TEACHER",
    ADMIN: "ADMIN"
} as const;
export type Role = (typeof Role)[keyof typeof Role];
export const Gender = {
    Male: "Male",
    Female: "Female"
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];
export type access_tokens = {
    id: Generated<number>;
    expired_at: Timestamp;
    created_at: Generated<Timestamp>;
    user_id: number;
};
export type permissions = {
    id: Generated<number>;
    name: string;
    created_at: Generated<Timestamp>;
    updated_at: Timestamp;
    deleted_at: Timestamp | null;
};
export type profiles = {
    id: Generated<number>;
    phone_number: string | null;
    date_of_birth: Timestamp;
    gender: Gender;
    address: string | null;
    social_links: unknown | null;
    user_id: number;
    created_at: Generated<Timestamp>;
    updated_at: Timestamp;
    deleted_at: Timestamp | null;
};
export type refresh_tokens = {
    id: Generated<number>;
    expired_at: Timestamp;
    created_at: Generated<Timestamp>;
    user_id: number;
    access_token_id: number;
};
export type role_permissions = {
    id: Generated<number>;
    role_id: number;
    permission_id: number;
};
export type roles = {
    id: Generated<number>;
    name: Generated<Role>;
    created_at: Generated<Timestamp>;
    updated_at: Timestamp;
    deleted_at: Timestamp | null;
};
export type user_roles = {
    id: Generated<number>;
    user_id: number;
    role_id: number;
};
export type users = {
    id: Generated<number>;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    is_verified: Generated<boolean>;
    avatar_url: string | null;
    created_at: Generated<Timestamp>;
    updated_at: Timestamp;
    deleted_at: Timestamp | null;
};
export type DB = {
    access_tokens: access_tokens;
    permissions: permissions;
    profiles: profiles;
    refresh_tokens: refresh_tokens;
    role_permissions: role_permissions;
    roles: roles;
    user_roles: user_roles;
    users: users;
};
