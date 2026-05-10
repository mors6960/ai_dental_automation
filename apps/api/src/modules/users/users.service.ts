import { Injectable } from "@nestjs/common";

import { createServicePayload, executeServiceAction } from "@/common/utils/response.util";
import { AuthRepository } from "@/modules/auth/auth.repository";

@Injectable()
export class UsersService {
  constructor(private readonly authRepository: AuthRepository) {}

  async findAll() {
    return executeServiceAction({
      fallbackMessage: "Unable to fetch users.",
      action: async () =>
        createServicePayload("Users fetched successfully.", [
          ...(await this.authRepository.findActiveUsers()).map((user) => ({
            id: user.id,
            fullName: `${user.firstName} ${user.lastName}`.trim(),
            email: user.email,
            role: user.role,
            status: user.status,
          })),
        ]),
    });
  }
}
