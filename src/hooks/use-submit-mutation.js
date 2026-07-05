import { useMutation } from "@tanstack/react-query";
import { useCallback, useRef } from "react";

/**
 * Wraps useMutation to prevent duplicate submissions from rapid clicks.
 * Returns `submit` (use instead of `mutate`) and `isSubmitting` for button state.
 */
export function useSubmitMutation(options) {
  const guardRef = useRef(false);
  const mutation = useMutation(options);

  const submit = useCallback(
    (variables, mutateOptions) => {
      if (guardRef.current || mutation.isPending) return;
      guardRef.current = true;

      mutation.mutate(variables, {
        ...mutateOptions,
        onSettled: (data, error, vars, context) => {
          guardRef.current = false;
          mutateOptions?.onSettled?.(data, error, vars, context);
        },
      });
    },
    [mutation]
  );

  return {
    ...mutation,
    submit,
    isSubmitting: mutation.isPending,
  };
}
