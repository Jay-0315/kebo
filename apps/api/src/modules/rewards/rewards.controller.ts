import { Controller, Get, Query } from "@nestjs/common";
import { RewardsService } from "./rewards.service";

@Controller("rewards")
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get("summary")
  getSummary(@Query("userId") userId: string) {
    return this.rewardsService.getSummary(userId);
  }
}
