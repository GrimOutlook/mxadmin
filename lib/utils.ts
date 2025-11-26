import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type Nullable<T> = {
  [K in keyof T]: T[K] | null;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function basic_auth(username: string, password: string): string {
  return 'Basic ' + btoa(`${username}:${password}`);
}

export function alias_string(alias: string, domain: string, target: string): string {
  return `${alias}@${domain} ➜ ${target}`;
}

export interface DomainCardProps {
  domain: string;
}
