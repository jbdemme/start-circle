/**
 * Query Keys Factory
 *
 * Centralized query keys following TanStack Query best practices.
 * This allows for type-safe query keys and easy cache invalidation.
 *
 * @see https://tanstack.com/query/latest/docs/react/guides/query-keys
 */

export const jobKeys = {
  all: ["jobs"] as const,
  lists: () => [...jobKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...jobKeys.lists(), filters] as const,
  details: () => [...jobKeys.all, "detail"] as const,
  detail: (id: string | number) => [...jobKeys.details(), id] as const,
} as const;

export const profileKeys = {
  all: ["profiles"] as const,
  me: () => [...profileKeys.all, "me"] as const,
  detail: (id: string) => [...profileKeys.all, id] as const,
} as const;
