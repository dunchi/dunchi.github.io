// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://dunchi.github.io',
  // 프로젝트 사이트라 하위 경로에 배포된다. 루트로 옮기면 base를 지우면 된다.
  base: '/google-blog',
  markdown: {
    shikiConfig: { theme: 'github-light', wrap: false },
  },
});
