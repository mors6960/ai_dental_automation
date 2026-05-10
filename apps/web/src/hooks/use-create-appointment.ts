import { useMutation } from "@tanstack/react-query";

import {
  createAppointment,
  type CreateAppointmentInput,
} from "@/lib/landing-api";

export function useCreateAppointment() {
  return useMutation({
    mutationFn: async (input: CreateAppointmentInput) => createAppointment(input),
  });
}
