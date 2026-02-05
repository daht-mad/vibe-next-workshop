# 슬랙 (Slack) 연동 가이드

## 연동 방식: Incoming Webhook

메시지 발송만 필요하므로 가장 간단한 Incoming Webhook 방식을 사용합니다.

---

## 1단계: Slack 앱 생성

1. https://api.slack.com/apps 접속
2. **Create New App** 클릭
3. **From scratch** 선택
4. 앱 이름 입력 (예: "Daily Feedback Bot")
5. 워크스페이스 선택
6. **Create App** 클릭

---

## 2단계: Incoming Webhooks 활성화

1. 왼쪽 메뉴에서 **Incoming Webhooks** 클릭
2. **Activate Incoming Webhooks** 토글 켜기
3. 페이지 하단 **Add New Webhook to Workspace** 클릭
4. 메시지를 보낼 채널 선택 (예: #스터디-운영)
5. **Allow** 클릭
6. **Webhook URL** 복사

Webhook URL 예시:
```
https://hooks.slack.com/services/YOUR_TEAM_ID/YOUR_BOT_ID/YOUR_WEBHOOK_TOKEN
```

---

## 3단계: 환경변수 설정

```bash
export SLACK_WEBHOOK_URL="YOUR_SLACK_WEBHOOK_URL_HERE"
```

또는 `~/.zshrc`에 추가:

```bash
echo 'export SLACK_WEBHOOK_URL="https://hooks.slack.com/services/..."' >> ~/.zshrc
source ~/.zshrc
```

---

## 4단계: 메시지 발송 코드 예시

```javascript
const https = require('https');

const sendSlackMessage = async (message) => {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  const url = new URL(webhookUrl);

  const payload = JSON.stringify({
    text: message,
    // 또는 blocks를 사용해서 더 예쁘게
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '📊 오늘의 스터디 피드백 요약',
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: message,
        },
      },
    ],
  });

  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: url.hostname,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
        },
      },
      (res) => {
        if (res.statusCode === 200) {
          resolve('메시지 발송 성공!');
        } else {
          reject(new Error(`발송 실패: ${res.statusCode}`));
        }
      }
    );

    req.on('error', reject);
    req.write(payload);
    req.end();
  });
};

// 사용 예시
await sendSlackMessage(`
*전체 요약*
오늘 5개 스터디 설문을 처리했어요.

*눈여겨볼 피드백*
> "진행 속도가 조금 더 빨랐으면 좋겠어요" - AI 기초반

*내 생각*
다음 주부터 타이머 도입을 검토해볼게요.

*액션 아이템*
- [ ] 스터디장 미팅에서 속도 조절 논의
- [ ] 타이머 앱 리서치
`);
```

---

## 간단한 테스트

터미널에서 바로 테스트:

```bash
curl -X POST -H 'Content-type: application/json' \
  --data '{"text":"테스트 메시지입니다!"}' \
  $SLACK_WEBHOOK_URL
```

`ok` 응답이 오면 성공!

---

## 메시지 포맷팅 (mrkdwn)

슬랙은 마크다운과 비슷한 `mrkdwn` 포맷을 사용합니다:

| 포맷 | 문법 | 결과 |
|------|------|------|
| 굵게 | `*텍스트*` | **텍스트** |
| 기울임 | `_텍스트_` | _텍스트_ |
| 취소선 | `~텍스트~` | ~~텍스트~~ |
| 인용 | `> 텍스트` | > 텍스트 |
| 코드 | `` `텍스트` `` | `텍스트` |
| 링크 | `<URL\|텍스트>` | [텍스트](URL) |
| 멘션 | `<@USER_ID>` | @사용자 |

---

## 문제 해결

| 증상 | 원인 | 해결 |
|------|------|------|
| "no_service" | Webhook URL 잘못됨 | URL 다시 복사 |
| "channel_not_found" | 채널 삭제됨 | 새 Webhook 생성 |
| 403 에러 | 앱이 워크스페이스에서 제거됨 | 앱 다시 설치 |

---

## 보안 참고사항

- Webhook URL은 **절대** 공개하지 마세요 (누구나 메시지 발송 가능)
- 환경변수로 관리
- `.gitignore`에 `.env` 추가

---

**예상 설정 시간**: 10분
