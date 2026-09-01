/* 카테고리 트리.
   dir  = 실제 폴더명(영문). URL 에도 이게 쓰인다.
   name = 화면에 뜨는 이름(한글). 여기만 고치면 표시가 바뀐다.

   글의 소속은 src/content/posts/<group>/<dir>/... 폴더 위치가 결정한다.
   이 파일이 정하는 것은 이름과 순서뿐이고, 깊이 제한은 없다 —
   children 을 계속 중첩하면 사이드바가 재귀로 따라 그린다. */

export type Category = { dir: string; name: string; children?: Category[] };
export type Group = { dir: string; name: string; items: Category[] };

export const GROUPS: Group[] = [
  {
    dir: 'macbook',
    name: 'MacBook',
    items: [
      { dir: 'setup', name: '환경설정' },
      {
        dir: 'lecture',
        name: '강의',
        children: [
          { dir: 'notes', name: '내용 정리' },
          { dir: 'mission', name: '미션' },
          { dir: 'review', name: '수강 소감' },
        ],
      },
    ],
  },
  {
    dir: 'dev',
    name: 'dev',
    items: [
      { dir: 'ai', name: 'AI' },
      { dir: 'n8n', name: 'n8n' },
      { dir: 'window', name: 'Window' },
      {
        dir: 'csharp',
        name: 'C#',
        children: [
          { dir: 'winform', name: 'Winform' },
          { dir: 'maui', name: 'MAUI' },
        ],
      },
      { dir: 'db', name: 'DB' },
      { dir: 'android', name: 'Android' },
      { dir: 'java', name: 'Java' },
      { dir: 'php', name: 'PHP' },
      {
        dir: 'python',
        name: 'Python',
        children: [{ dir: 'basics', name: '기초 및 입문' }],
      },
      {
        dir: 'unity',
        name: 'Unity',
        children: [
          { dir: 'setup', name: '환경설정' },
          { dir: 'errors', name: '오류' },
          { dir: 'study', name: '연습&공부' },
        ],
      },
      { dir: 'web', name: 'WEB' },
      { dir: 'git', name: 'Git' },
      { dir: 'vm', name: 'VM' },
      { dir: 'notion', name: 'Notion' },
    ],
  },
  {
    dir: 'etc',
    name: 'etc',
    items: [
      { dir: 'work', name: '회사', children: [{ dir: 'a', name: 'A' }] },
      {
        dir: 'memo',
        name: '메모',
        children: [
          { dir: 'general', name: '일반' },
          { dir: 'memories', name: '추억 모음' },
        ],
      },
      {
        dir: 'thoughts',
        name: '사색',
        children: [
          { dir: 'misc', name: '그냥' },
          { dir: 'developer', name: '개발자' },
        ],
      },
      {
        dir: 'branding',
        name: 'personal branding',
        children: [
          { dir: 'blog', name: '블로그' },
          { dir: 'portfolio', name: '포트폴리오' },
          { dir: 'health', name: '건강일기' },
          { dir: 'resume', name: '이력서 이력' },
        ],
      },
      { dir: 'hamtori', name: '?햄토리?' },
      {
        dir: 'diary-adult',
        name: '어른이 된 후 일기장',
        children: [
          { dir: 'jinju', name: '진주패밀리' },
          { dir: 'jobless', name: '백수 일기' },
          { dir: 'open', name: '비밀스럽지않은 일기장' },
          { dir: 'secret', name: '비밀스러운 일기장' },
        ],
      },
      { dir: 'diary-child', name: '어렸을 때 일기장' },
      {
        dir: 'diary-baby',
        name: '애기 때 일기장',
        children: [
          { dir: 'journal', name: '일기' },
          {
            dir: 'childhood',
            name: '어렸을 때 썼던 글들',
            children: [
              { dir: 'diary', name: 'Diary' },
              { dir: 'thinking', name: 'Thinking' },
              { dir: 'wondering', name: 'Wondering' },
            ],
          },
          { dir: 'admin', name: '관리' },
        ],
      },
      { dir: 'uncategorized', name: '미분류' },
    ],
  },
];
