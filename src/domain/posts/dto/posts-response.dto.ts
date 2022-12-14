import { ApiProperty } from '@nestjs/swagger';
import { Posts } from '../entity/posts.entity';

export class PostsResponse {
  @ApiProperty({
    example: '1',
    description: '게시물의 고유번호',
  })
  id: number;

  @ApiProperty({
    example: '한글입니다.',
    description: '게시물의 제목',
  })
  title: string;

  @ApiProperty({
    example: '  가나다라마바사',
    description: '게시물의 본문',
  })
  content: string;

  @ApiProperty({
    example: '  대체로 맑음',
    description: '날씨 정보입니다.',
  })
  weather: string;

  @ApiProperty({
    description: '게시물의 작성날짜',
  })
  createAt: Date;

  @ApiProperty({
    description: '게시물의 수정날짜',
  })
  updateAt: Date;
  constructor(
    id: number,
    title: string,
    content: string,
    weather: string,
    createAt: Date,
    updateAt: Date,
  ) {
    this.id = id;
    this.title = title;
    this.content = content;
    this.weather = weather;
    this.createAt = createAt;
    this.updateAt = updateAt;
  }

  static of(posts: Posts): PostsResponse {
    return new PostsResponse(
      posts.id,
      posts.title,
      posts.content,
      posts.weather,
      posts.createAt,
      posts.updateAt,
    );
  }
}
