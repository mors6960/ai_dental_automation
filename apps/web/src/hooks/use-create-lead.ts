import { useMutation } from "@tanstack/react-query";

import { createLead, type CreateLeadInput } from "@/lib/landing-api";

export function useCreateLead() {
  return useMutation({
    mutationFn: async (input: CreateLeadInput) => createLead(input),
  });
}
