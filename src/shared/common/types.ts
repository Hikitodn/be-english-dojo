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
    MALE: "MALE",
    FEMALE: "FEMALE"
} as const;
export type Gender = (typeof Gender)[keyof typeof Gender];
export const AttendanceStatus = {
    PRESENT: "PRESENT",
    ABSENT: "ABSENT",
    LATE: "LATE"
} as const;
export type AttendanceStatus = (typeof AttendanceStatus)[keyof typeof AttendanceStatus];
export const PaymentStatus = {
    PAID: "PAID",
    PENDING: "PENDING",
    FAILED: "FAILED"
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];
export const PaymentMethod = {
    COD: "COD",
    PAYPAL: "PAYPAL"
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];
export const StudentStatus = {
    PENDING: "PENDING",
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE"
} as const;
export type StudentStatus = (typeof StudentStatus)[keyof typeof StudentStatus];
export type access_tokens = {
    id: Generated<number>;
    expired_at: Timestamp;
    created_at: Generated<Timestamp>;
    user_id: number;
};
export type attendances = {
    id: Generated<number>;
    status: AttendanceStatus;
    user_id: number | null;
    classroom_id: number | null;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type classrooms = {
    id: Generated<number>;
    code: string;
    name: string;
    capacity: number;
    background_url: string | null;
    tuition_fee: string;
    start_date: Timestamp;
    end_date: Timestamp;
    total_student: Generated<number>;
    total_teacher: Generated<number>;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
};
export type lesson_resources = {
    id: Generated<number>;
    name: string;
    type: string;
    url: string;
    lesson_id: number;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type lessons = {
    id: Generated<number>;
    topic: string | null;
    note: string | null;
    classroom_id: number;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type payments = {
    id: Generated<number>;
    order_id: string;
    transaction: unknown | null;
    tuition_history_id: number;
};
export type permissions = {
    id: Generated<number>;
    name: string;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
};
export type profiles = {
    id: Generated<number>;
    phone_number: string | null;
    date_of_birth: Timestamp;
    gender: Gender;
    address: string | null;
    social_links: string[];
    user_id: number;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
};
export type question_options = {
    id: Generated<number>;
    text: string;
    file_url: string | null;
    is_correct: boolean;
    question_id: number;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type questions = {
    id: Generated<number>;
    text: string;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
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
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type roles = {
    id: Generated<number>;
    name: Role;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
};
export type schedules = {
    id: Generated<number>;
    day_of_week: number;
    start_time: string;
    end_time: string;
    classroom_id: number;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type test_questions = {
    id: Generated<number>;
    question_id: number;
    test_id: number;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type tests = {
    id: Generated<number>;
    name: string;
    description: string | null;
    lesson_id: number;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type tuition_histories = {
    id: Generated<number>;
    amount: string;
    paid_date: Timestamp;
    status: PaymentStatus;
    method: PaymentMethod;
    note: string | null;
    classroom_id: number;
    user_id: number;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type user_classrooms = {
    id: Generated<number>;
    classroom_id: number | null;
    student_id: number | null;
    teacher_id: number | null;
    absent_count: Generated<number>;
    status: StudentStatus | null;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
};
export type user_roles = {
    id: Generated<number>;
    user_id: number;
    role_id: number;
    created_at: Generated<Timestamp>;
    updated_at: Generated<Timestamp>;
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
    updated_at: Generated<Timestamp>;
    deleted_at: Timestamp | null;
};
export type DB = {
    access_tokens: access_tokens;
    attendances: attendances;
    classrooms: classrooms;
    lesson_resources: lesson_resources;
    lessons: lessons;
    payments: payments;
    permissions: permissions;
    profiles: profiles;
    question_options: question_options;
    questions: questions;
    refresh_tokens: refresh_tokens;
    role_permissions: role_permissions;
    roles: roles;
    schedules: schedules;
    test_questions: test_questions;
    tests: tests;
    tuition_histories: tuition_histories;
    user_classrooms: user_classrooms;
    user_roles: user_roles;
    users: users;
};
