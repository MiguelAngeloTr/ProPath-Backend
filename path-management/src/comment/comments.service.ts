import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../entities/comment.entity';
import { CommentDto } from '../dtos/comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
  ) {}

  async findAll(): Promise<Comment[]> {
    return this.commentRepository.find();
  }

  async findById(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({ 
      where: { id } 
    });
    
    if (!comment) {
      throw new NotFoundException(`Comment with ID ${id} not found`);
    }
    
    return comment;
  }

  async findByActivityId(activityId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { activityId },
    });
  }

  async findByPathId(pathId: string): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { pathId },
    });
  }

  async create(commentDto: CommentDto): Promise<Comment> {
    const comment = this.commentRepository.create(commentDto);
    return this.commentRepository.save(comment);
  }

  async update(id: string, commentDto: CommentDto): Promise<Comment> {
    await this.findById(id);
    await this.commentRepository.update(id, commentDto);
    return this.findById(id);
  }

  async remove(id: string): Promise<boolean> {
    const result = await this.commentRepository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }
}