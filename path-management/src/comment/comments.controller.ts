import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { CommentsService } from './comments.service';
import { CommentDto } from '../dtos/comment.dto';

@Controller()
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @MessagePattern({ cmd: 'get_all_comments' })
  async getAllComments() {
    return this.commentsService.findAll();
  }

  @MessagePattern({ cmd: 'get_comment_by_id' })
  async getCommentById(id: string) {
    return this.commentsService.findById(id);
  }

  @MessagePattern({ cmd: 'create_comment' })
  async createComment(createCommentDto: CommentDto) {
    return this.commentsService.create(createCommentDto);
  }

  @MessagePattern({ cmd: 'update_comment' })
  async updateComment(data: { id: string; comment: CommentDto }) {
    const { id, comment } = data;
    return this.commentsService.update(id, comment);
  }

  @MessagePattern({ cmd: 'delete_comment' })
  async deleteComment(id: string) {
    return this.commentsService.remove(id);
  }

  @MessagePattern({ cmd: 'get_comments_by_activity' })
  async getCommentsByActivity(activityId: string) {
    return this.commentsService.findByActivityId(activityId);
  }

  @MessagePattern({ cmd: 'get_comments_by_path' })
  async getCommentsByPath(pathId: string) {
    return this.commentsService.findByPathId(pathId);
  }
}