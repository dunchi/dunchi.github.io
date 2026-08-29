/** base 경로를 붙여준다. astro.config 의 base 를 바꿔도 링크가 안 깨진다. */
export function url(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + (path.startsWith('/') ? path : '/' + path);
}
