---
title: Docker Swarm에서 무중단 배포가 무중단이 아니었던 이유
date: 2026-08-12
description: rolling update를 걸어뒀는데도 배포할 때마다 502가 몇 초씩 떴다. 헬스체크와 종료 순서 문제였다.
tags: [docker, infra, deploy]
---

스테이지 스웜에 `update-config`를 걸어뒀으니 당연히 무중단일 줄 알았다. 아니었다.

## 증상

배포할 때마다 3~7초쯤 502가 뜬다. 요청량이 적어서 오래 몰랐다.

## 원인

두 가지가 겹쳤다.

1. **헬스체크가 없었다.** 컨테이너가 뜨자마자 `running`이 되고, Swarm은 그때 바로 라우팅을 넘긴다. 애플리케이션은 아직 기동 중이다.
2. **기존 컨테이너가 너무 빨리 죽었다.** `SIGTERM`을 받고 처리 중이던 요청을 버렸다.

## 고친 것

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:8080/actuator/health"]
  interval: 10s
  timeout: 3s
  retries: 3
  start_period: 40s

deploy:
  update_config:
    order: start-first
    failure_action: rollback
  stop_grace_period: 30s
```

핵심은 `order: start-first`다. 기본값은 `stop-first`라서 **먼저 죽이고 나서 띄운다.** 그 사이가 통째로 빈다.

## 교훈

> 무중단 배포는 옵션 하나가 아니라 **헬스체크 + 기동 순서 + 종료 유예** 세 개가 다 맞아야 성립한다.
