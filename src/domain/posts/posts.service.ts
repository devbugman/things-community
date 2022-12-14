import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostsDto } from './dto/create-posts.dto';
import { Posts } from './entity/posts.entity';
import * as bcrypt from 'bcrypt';
import { PostsResponse } from './dto/posts-response.dto';
import { UpdatePostsDto } from './dto/update-posts.dto';
import { DeletePostsDto } from './dto/delete-posts.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts) private postsRepository: Repository<Posts>,
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}
  /**
   *
   * @param createPostsDto 게시글 생성
   * @returns 게시글 생성 번호
   */
  async create(createPostsDto: CreatePostsDto): Promise<number> {
    const password = createPostsDto.Password;
    // 비밀번호 암호화
    const hashpassword = await bcrypt.hash(password, 10);
    const weather = await this.getWeather();

    const saveposts = await this.postsRepository.save(
      createPostsDto.toEntity(hashpassword, weather.text),
    );

    return saveposts.id;
  }

  /**
   *
   * @param id 게시글 아이디
   * @returns 게시글 상세정보
   */
  async findById(id: number): Promise<PostsResponse> {
    const posts: Posts = await this.postsRepository.findOneBy({ id });
    if (!posts) {
      throw new HttpException(
        '존재하지 않은 게시물입니다.',
        HttpStatus.NOT_FOUND,
      );
    }
    return PostsResponse.of(posts);
  }

  /**
   *
   * @param page 페이지 번호
   * @returns 페이지 리스트
   */
  async findAll(page: number): Promise<PostsResponse[]> {
    try {
      const pagesize: number = 20;
      const postsList: Posts[] = await this.postsRepository.find({
        select: {
          id: true,
          title: true,
          content: true,
          weather: true,
          createAt: true,
          updateAt: true,
        },
        order: { createAt: 'desc' },
        skip: (page - 1) * pagesize,
        take: pagesize,
      });
      return postsList.map((m) => PostsResponse.of(m));
    } catch (error) {
      throw new HttpException(
        '게시글을 조회하지 못했습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /**
   * @param id 게시글 아이디
   *
   */
  async update(
    id: number,
    updatePostsDto: UpdatePostsDto,
  ): Promise<PostsResponse> {
    const { title, content, password } = updatePostsDto;
    const findPosts: Posts = await this.postsRepository.findOneBy({ id });
    if (!findPosts || findPosts.isDeleted()) {
      throw new HttpException(
        '존재하지 않은 게시물입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!(await bcrypt.compare(password, findPosts.password))) {
      throw new HttpException(
        '비밀번호가 일치하지 않습니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    findPosts.update(title, content);
    await this.postsRepository.update(id, findPosts);
    return PostsResponse.of(findPosts);
  }

  async remove(id: number, deletePostsDto: DeletePostsDto) {
    const findPosts: Posts = await this.postsRepository.findOneBy({ id });
    if (!findPosts || findPosts.isDeleted()) {
      throw new HttpException(
        '존재하지 않은 게시물입니다.',
        HttpStatus.NOT_FOUND,
      );
    }

    if (!(await bcrypt.compare(deletePostsDto.password, findPosts.password))) {
      throw new HttpException(
        '비밀번호가 일치하지 않습니다.',
        HttpStatus.FORBIDDEN,
      );
    }

    findPosts.delete();
    this.postsRepository.update(id, findPosts);
  }

  async getWeather() {
    try {
      const url = this.configService.get<string>('URL');
      console.log(url);
      const response = await firstValueFrom(
        this.httpService.get(`
        ${url}/current.json?key=${this.configService.get(
          'API_KEY',
        )}&q=Korea&lang=ko`),
      );
      return response.data.current.condition;
    } catch (e) {
      console.error(e.message);
      throw new HttpException(
        '날씨 정보를 찾지못하였습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
