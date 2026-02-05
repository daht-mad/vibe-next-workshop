# 에어테이블 (Airtable) 연동 가이드

## 연동 방식: MCP

Claude Code가 직접 에어테이블 데이터를 읽을 수 있도록 MCP로 연동합니다.

---

## 1단계: Personal Access Token 발급

1. https://airtable.com/create/tokens 접속
2. **Create new token** 클릭
3. 토큰 이름 입력 (예: "Claude Code 연동")
4. **Scopes** 설정:
   - `data.records:read` (필수 - 설문 데이터 읽기용)
5. **Access** 설정:
   - 설문 데이터가 있는 Base 선택
6. **Create token** 클릭
7. 토큰 복사 (이 화면을 벗어나면 다시 볼 수 없음!)

---

## 2단계: Base ID 확인

1. 에어테이블에서 설문 데이터가 있는 Base 열기
2. URL에서 Base ID 확인:
   ```
   https://airtable.com/appXXXXXXXXXXXXXX/...
                        ↑ 이 부분이 Base ID
   ```
3. `app`으로 시작하는 문자열을 메모

---

## 3단계: MCP 설정

`~/.mcp.json` 파일에 다음 내용 추가:

```json
{
  "mcpServers": {
    "airtable": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-server-airtable"],
      "env": {
        "AIRTABLE_API_KEY": "여기에_토큰_붙여넣기",
        "AIRTABLE_BASE_ID": "여기에_Base_ID_붙여넣기"
      }
    }
  }
}
```

---

## 4단계: Claude Code 재시작

MCP 설정은 재시작해야 적용됩니다.

```bash
# Claude Code 종료 후 다시 시작
```

---

## 확인 방법

Claude Code에서:
```
에어테이블에서 설문 테이블 보여줘
```

정상 응답이 오면 연동 성공!

---

## 문제 해결

| 증상 | 원인 | 해결 |
|------|------|------|
| "연결 실패" | 토큰 잘못됨 | 토큰 재발급 |
| "권한 없음" | Scope 부족 | `data.records:read` 권한 확인 |
| "Base 없음" | Base ID 잘못됨 | URL에서 Base ID 다시 확인 |

---

## 참고: airtable.js 코드 예시

MCP 대신 스크립트로 직접 연동할 경우:

```javascript
const Airtable = require('airtable');

// 환경변수 또는 직접 입력
const base = new Airtable({
  apiKey: process.env.AIRTABLE_API_KEY
}).base(process.env.AIRTABLE_BASE_ID);

// 설문 데이터 가져오기
const loadSurveys = async () => {
  const records = [];

  await base('설문응답').select({
    filterByFormula: `IS_SAME(CREATED_TIME(), TODAY(), 'day')`,
    sort: [{ field: '스터디명', direction: 'asc' }]
  }).eachPage((pageRecords, fetchNextPage) => {
    records.push(...pageRecords);
    fetchNextPage();
  });

  return records;
};
```

---

**예상 설정 시간**: 10-15분
