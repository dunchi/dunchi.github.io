// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://dunchi.github.io',
  // 프로젝트 사이트라 하위 경로에 배포된다. 루트로 옮기면 base를 지우면 된다.
  base: '/google-blog',
  // 검색 결과가 메인이 되기 전 주소. 들어오면 루트로 넘긴다.
  redirects: { '/search': '/' },
  markdown: {
    shikiConfig: { theme: 'github-light', wrap: false },
  },
});
