# 1. 서비스 개요

> ### 게시판 업로드시 날씨 정보 제공을 하는 커뮤니티입니다.

## [구현 사항](#2-구현-사항)

## [Api 명세서](#3-api-명세)

### 📚 STACKS

<div align="center">
  <img src="https://img.shields.io/badge/node-16.17.0-339933?logo=node.js"> 
  <img src="https://img.shields.io/badge/NestJS-9.0.0-E0234E?logo=NestJS"> 
  <img src="https://img.shields.io/badge/TypeScript-4.4.5-3178C6?logo=typescript"> 
  <img src="https://img.shields.io/badge/mysql-8.0.12-4479A1?logo=mysql"> 
  <img src="https://img.shields.io/badge/Swagger-6.1.2-DC382D?logo=swagger"> 
  <img src="https://img.shields.io/badge/TypeORM-0.3.9-010101"> 
</div>

# 2. 구현 사항

## 요구사항

## 1. 사용자는 게시글을 올릴 수 있습니다.

> ### 게시글은 제목과 본문으로 구성됩니다.
>
> ### 제목은 최대 20 자, 본문은 200 자로 서버에서 제한해야 합니다.
>
> - class-validator로 길이를 제한
>
> ### 제목과 본문 모두 이모지가 포함될 수 있습니다.
>
> - character set: utf8mb4_unicode_ci로 변경

 <br/>

## 2. 사용자는 게시글을 올릴 때 비밀번호를 설정할 수 있습니다. 추후 본인이 작성한 게시물에 비밀번호 입력 후 수정, 삭제할 수 있습니다.

> ### 비밀번호는 데이터베이스에 암호화 된 형태로 저장이 되어야 합니다.
>
> - bcrypt로 암호화 후 DB에 저장
>
> ### 비밀번호는 6 자 이상이어야 하고, 숫자 1 개 이상 반드시 포함 되어야 합니다.
>
> - class-validator 제공 정규 표현식 적용

<br/>

## 3. 모든 사용자는 한 페이지 내에서 모든 게시글을 최신 글 순서로 확인할 수 있습니다.

<br/>

# 3. Api 명세

https://succulent-wilderness-8a4.notion.site/ThingsFlow-Api-ba70c232b008454896af2e612b1d5cb5
