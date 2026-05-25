import { Module } from "@nestjs/common";
import { RewardsModule } from "../rewards/rewards.module";
import { CommunityController } from "./community.controller";
import { CommunityService } from "./community.service";

@Module({
  imports: [RewardsModule],
  controllers: [CommunityController],
  providers: [CommunityService],
})
export class CommunityModule {}
