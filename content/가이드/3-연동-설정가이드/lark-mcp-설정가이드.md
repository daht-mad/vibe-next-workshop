# Lark MCP 설정 가이드

> Lark(라크)를 Claude Code에서 사용하기 위한 설정 가이드입니다.
> 예상 소요 시간: 10~15분

---

## 핵심 개념 (30초)

| 용어 | 설명 |
|------|------|
| **Lark 앱** | Claude Code가 내 Lark에 접근할 수 있게 해주는 "통로" |
| **App ID / App Secret** | 앱의 아이디와 비밀번호. 이걸 Claude Code에게 알려주면 연동됨 |

**흐름**: Lark 앱 만들기 → App ID/Secret 복사 → Claude Code에게 설정해달라고 하기 → 끝!

---

## Step 1. Lark Open Platform 접속

1. **https://open.larksuite.com 접속**

2. **우측 상단 Sign In** → 회사 Lark 계정으로 로그인

> 접근이 안 되면 회사 IT 담당자에게 "Open Platform 접근 권한 달라"고 요청하세요.

---

## Step 2. 앱 만들기

1. 로그인 후 우측 상단 **Console** 클릭

2. **Create Custom App** 클릭

3. 앱 정보 입력:
   - **App Name**: 아무 이름 (예: `My Bot`)
   - **App Description**: 아무 설명
   
4. **Create** 클릭

---

## Step 3. App ID & App Secret 복사

1. 좌측 메뉴에서 **Credentials & Basic Info** 클릭

2. 다음 두 값을 **메모장에 복사**해두기:
   - **App ID**: `cli_` 로 시작하는 값
   - **App Secret**: 영문+숫자 조합

> ⚠️ App Secret은 비밀번호입니다. 외부에 노출하지 마세요!

---

## Step 4. 권한 추가

1. 좌측 메뉴에서 **Permissions & Scopes** 클릭

2. 사용할 기능에 맞는 권한 검색해서 **Add** 클릭:

| 기능 | 검색어 |
|------|--------|
| 문서 읽기/쓰기 | `docx:document` |
| 메시지 보내기 | `im:message` |
| 캘린더 | `calendar:calendar` |
| 할일 | `task:task` |

3. 페이지 하단 **Save** 클릭

---

## Step 5. 앱 배포

1. 좌측 메뉴에서 **Version Management & Release** 클릭

2. **Create Version** 클릭 → 버전 정보 입력 → **Save**

3. **Submit for Review** 클릭

> 회사 관리자가 승인해야 사용 가능합니다. 
> 테스트만 하려면 **Test Enterprise and Users** 메뉴에서 본인을 테스트 사용자로 추가하세요.

---

## Step 6. Claude Code에 설정하기

Claude Code에게 다음과 같이 요청하세요:

```
Lark MCP 설정해줘.
- App ID: cli_xxxxxxxx
- App Secret: yyyyyyyyyyyy
```

Claude Code가 알아서 설정 파일을 만들어줍니다.

---

## Step 7. 테스트

Claude Code를 **재시작**한 후 요청:

```
Lark에서 내 캘린더 일정 보여줘
```

또는:

```
Lark 그룹 채팅 목록 가져와줘
```

---

## 개인 캘린더/문서 접근이 안 될 때

개인 데이터에 접근하려면 추가 로그인이 필요합니다.

Claude Code에게 요청:

```
Lark 사용자 로그인해줘.
- App ID: cli_xxxxxxxx
- App Secret: yyyyyyyyyyyy
```

브라우저가 열리면 Lark 계정으로 로그인하세요.

---

## 문제 해결

| 문제 | 해결 |
|------|------|
| "권한이 없습니다" | Step 4에서 권한 추가했는지 확인 → 앱 재배포 |
| "앱을 찾을 수 없습니다" | Step 5에서 앱 배포했는지 확인 |
| MCP가 안 됨 | Claude Code 완전히 종료 후 재시작 |

---

## 체크리스트

- [ ] Lark Open Platform 로그인
- [ ] 앱 생성
- [ ] App ID / App Secret 복사
- [ ] 필요한 권한 추가
- [ ] 앱 버전 생성 & 배포 (또는 테스트 사용자 추가)
- [ ] Claude Code에게 "Lark MCP 설정해줘" 요청
- [ ] Claude Code 재시작 후 테스트
