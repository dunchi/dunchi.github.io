---
title: NetBird 삽질기 — 시간을 날린 두 가지
date: 2026-08-28
description: 둘 다 "확인했다고 생각한 것"이었다. DB를 열어봤으니 확인한 것 같았고, status가 초록이니 붙은 것 같았다. 둘 다 아니었다.
tags: [netbird, vpn, infra]
---

스테이지 망 접근 정책을 손보다가 이틀을 날렸다. 원인은 둘 다 **"확인했다고 착각한 것"** 이었다.

## 1. store.db를 직접 열지 마라

NetBird 설정을 확인하겠다고 `store.db`를 뒤졌다.

```bash
docker run --rm -it -v /var/lib/netbird:/data alpine \
  sh -c "apk add --no-cache sqlite && sqlite3 /data/store.db '.tables'"
```

호출 한 번에 수십 초가 걸린다. `apk add`가 매번 새로 도는 탓이다.

그런데 그룹·정책·라우트·peer는 **전부 API로 즉시 조회된다.**

| 방법 | 소요 |
| --- | --- |
| `sqlite3 store.db` | 48.2s |
| `GET /api/groups` | 0.2s |

토큰이 없어서 DB를 팠던 건데, 순서가 틀렸다. **토큰을 먼저 요청했어야 했다.**

## 2. `netbird status` 요약을 믿지 마라

정상적으로 붙어 있는데도 이렇게 보인다.

```
Networks: -
Peers count: 0/1
```

lazy connection 때문이다. 트래픽이 흐르기 전까지는 연결을 맺지 않으니, 요약만 보면 끊긴 것처럼 보인다.

판정은 반드시 실제 TCP 접속으로 한다.

```bash
timeout 5 bash -c "echo > /dev/tcp/10.10.2.9/2377" && echo "OK"
```

## 남은 것

- 상태 요약은 **관측 결과가 아니라 캐시**일 수 있다
- 느린 확인 방법을 쓰고 있다면, 대개 더 빠른 정식 경로가 있다
- 그 경로를 막고 있는 게 권한이라면, 우회하지 말고 권한을 요청하는 게 빠르다
