# 개발 중 문제점
- 현재 페이지네이션을 게시글의 primary key인 id를 이용 (자동 증가로 삭제 시 번호가 순차적이지 않음)
- 다음 페이지, 이전 페이지 구현이 어려움 (현재 페이지 아이디에 1을 추가하여 url 요청 -> id가 순차적이지 않아 error)
- 무한 스크롤 페이지 구현 시 다음 페이지를 append 할 때 사용할 데이터 요청 처리 어려움

## 페이징 대안
### 1. mysql 테이블 전체에 rownum 컬럼을 추가하기.
### 2. select해서 가져올 때 limit나 rownum을 구현 쿼리를 날려서 가져오기.
- 다음 페이지 요청 날리기 (현재 페이지 id 전송)
- (현재 페이지 id의 index + 1)의 id로 redirect
```
select @ROWNUM := @ROWNUM + 1 AS ROWNUM, T.* from board3 T, (SELECT @ROWNUM := 0) TMP ORDER BY ID asc;
```

## 무한 스크롤 문제
- 한 페이지를 3개의 포스트로 정함 (한 번 스크롤 시 3개의 포스트가 더 추가됨)
- 무한 스크롤 게시판으로 접속 시 첫 화면은 3개의 포스트가 미리 출력되어 있어야 함.
- 스크롤 시 3개의 포스트가 아래에 추가
- 스크롤 시 아래에 페이지 네이션 바 추가, 번호 추가
- append된 버튼의 클릭 이벤트 작동 x -> jquery on 메서드 사용 => 댓글/게시글 삭제, 등록 등의 모든 클릭 이벤트 바꿔줘야 함.

## 무한 스크롤 대안
### 1. 서버에서 특정 게시판에 대한 라우팅 추가 후 SELECT ROWNUM
- 다른 게시판과 달리 페이지, 포스트 넘버에 대한 url 제거 (/board/:bn/~:pn~/~:id~)
- ajax로 3개의 포스트와 해당 댓글 가져온 후 append
 + 서버에서 전송해야 할 데이터 (각각의 포스트 제목, 내용, 날짜 / 댓글 이름, 내용, 날짜)
  ++ row로 넘기면 res.json 가능
+ ### 문제
  + 댓글 가져오기 -> 가져온 게시물 ID에 맞는 댓글 가져오기 -> SELECT한 게시물 아이디 하나씩 저장 후 갯수만큼 댓글 쿼리 돌림?
  + 반복이 많아져서 where 절에 id or id or id


# 11-16
### 다음 페이지, 이전 페이지 구현
- 페이지네이션 설계 오류 -> ID 대신 limit, rownum -> 페이징 기능을 바꾸면 라우팅을 새로? / 아님 페이지네이션 자체의 로직 변경?

### 오류 잡기 구현 미숙
- 오류 코드
- try-catch 부재

### 댓글 추가 시 현재페이지에서 추가
- 이름, 내용, 날짜는 추가 가능
- 삭제, 수정 시 value에 ID 추가를 어떻게 할 것인지 -> INSERT 후 SELECT로 ID 받아와서 JS에서 APPEND?

<br><br>
# 개선할 사항
- 코드 중복 -> Module 패턴 적용 (class.?)
- 
