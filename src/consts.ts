export const SITE = {
  /** 워드마크에 그대로 쓰인다. 글자 수만큼 구글 색이 순환한다. */
  title: 'dunchi',
  description: '백엔드·인프라 개발자의 작업 기록',
  author: '김한주',
  url: 'https://dunchi.github.io',
  github: 'https://github.com/dunchi',
  email: 'pearl.dunchi@gmail.com',
} as const;

export const PAGE_SIZE = 10;

/** 프로필 카드에 뜨는 바깥 링크들 */
export const LINKS = [
  { icon: 'github', label: 'GitHub', href: 'https://github.com/dunchi' },
  { icon: 'tistory', label: '구 블로그', href: 'https://aiwcpd.tistory.com' },
  { icon: 'resume', label: '구 이력서', href: 'https://dunchi.github.io/docs/README.md.html' },
  { icon: 'youtube', label: 'YouTube', href: 'https://www.youtube.com/channel/UCXkAt4TGK0L1NF8gr-LuZEQ' },
  // TODO: 실제 주소로 교체
  { icon: 'kakao', label: '카카오톡 오픈프로필', href: 'https://open.kakao.com/o/CHANGE_ME' },
  { icon: 'kakao', label: '카카오톡 1:1 채팅', href: 'https://qr.kakao.com/talk/CHANGE_ME' },
] as const;
