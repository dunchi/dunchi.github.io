# google-blog

구글 검색 화면 컨셉의 개인 기술 블로그. Astro 기반.

> 이 프로젝트는 구글 검색 UI에서 영감을 받은 **개인 오마주**입니다.
> Google LLC와 아무 관련이 없고, 구글의 로고·워드마크·아이콘 원본을 사용하지 않습니다.
> 모든 색·치수·아이콘은 직접 작성했습니다.

## 명령어

```bash
npm install
npm run dev      # http://localhost:4321/google-blog
npm run build
```

## 배포

`main`에 push하면 Actions가 빌드해서 `https://dunchi.github.io/google-blog/` 에 올린다.

프로젝트 사이트라 `astro.config.mjs` 에 `base: '/google-blog'` 가 있다.
나중에 루트(`dunchi.github.io`)로 옮기면 그 줄만 지우면 된다.
**링크는 반드시 `src/lib/url.ts` 의 `url()` 을 거칠 것.** 안 그러면 하위 경로에서 깨진다.

## 라이선스

별도 라이선스 파일이 없으므로 **모든 권리 보유(All rights reserved)** 입니다.
소스를 열람하는 것은 자유지만, 복제·재배포·2차 저작물 작성은 허락하지 않습니다.
