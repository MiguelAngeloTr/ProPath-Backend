export interface CommentDto {
    id: string;
    authorId: string;
    authorName: string;
    message: string;
    date: Date;
    activityId?: string;
    pathId?: string;
}