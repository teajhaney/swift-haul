import { toast } from "sonner";

/**
 * Typed toast helpers — use these everywhere instead of calling sonner directly.
 * Keeps toast calls consistent and easy to update globally.
 */
export const notify = {
  success: (title: string, description?: string) =>
    toast.success(title, { description }),

  error: (title: string, description?: string) =>
    toast.error(title, { description }),

  warning: (title: string, description?: string) =>
    toast.warning(title, { description }),

  info: (title: string, description?: string) =>
    toast.info(title, { description }),
};
