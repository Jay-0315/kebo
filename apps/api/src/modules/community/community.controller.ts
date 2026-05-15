import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from "@nestjs/common";
import { CommunityService } from "./community.service";
import { CreateCommunityPostDto } from "./dto/create-community-post.dto";
import { UpdateCommunityPostDto } from "./dto/update-community-post.dto";

@Controller("community/posts")
export class CommunityController {
  constructor(private readonly communityService: CommunityService) {}

  @Get()
  findAll(@Query("userId") userId?: string) {
    return this.communityService.findAll(userId);
  }

  @Post()
  create(@Body() dto: CreateCommunityPostDto) {
    return this.communityService.create(dto);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() dto: UpdateCommunityPostDto) {
    return this.communityService.update(id, dto);
  }

  @Post(":id/like")
  toggleLike(@Param("id") id: string) {
    return this.communityService.toggleLike(id);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.communityService.remove(id);
  }
}
