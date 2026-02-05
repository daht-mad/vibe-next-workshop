# Gmail 연동 가이드

## 연동 방식: 스크립트 (Nodemailer + 앱 비밀번호)

Gmail 계정에서 앱 비밀번호를 발급받아 이메일 발송에 사용합니다.

---

## 1단계: 2단계 인증 활성화

앱 비밀번호를 사용하려면 2단계 인증이 필수입니다.

1. https://myaccount.google.com/security 접속
2. **2단계 인증** 클릭
3. 안내에 따라 설정 (휴대폰 인증 등)

---

## 2단계: 앱 비밀번호 생성

1. https://myaccount.google.com/apppasswords 접속
2. **앱 선택**: "메일" 선택
3. **기기 선택**: "기타 (맞춤 이름)" 선택
4. 이름 입력 (예: "Claude Code 스킬")
5. **생성** 클릭
6. 16자리 비밀번호 복사 (공백 포함해서 복사해도 됨)

> **중요**: 이 비밀번호는 다시 볼 수 없으니 안전한 곳에 저장하세요!

---

## 3단계: 환경변수 설정

터미널에서 환경변수 설정 (또는 `.env` 파일 사용):

```bash
export GMAIL_USER="your-email@gmail.com"
export GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"
```

또는 `~/.zshrc` (또는 `~/.bashrc`)에 추가:

```bash
echo 'export GMAIL_USER="your-email@gmail.com"' >> ~/.zshrc
echo 'export GMAIL_APP_PASSWORD="xxxx xxxx xxxx xxxx"' >> ~/.zshrc
source ~/.zshrc
```

---

## 4단계: Nodemailer 코드 예시

```javascript
const nodemailer = require('nodemailer');

// 트랜스포터 설정
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// 이메일 발송 함수
const sendEmail = async ({ to, subject, html }) => {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to,
    subject,
    html,
  };

  try {
    const result = await transporter.sendMail(mailOptions);
    console.log('이메일 발송 성공:', result.messageId);
    return result;
  } catch (error) {
    console.error('이메일 발송 실패:', error);
    throw error;
  }
};

// 사용 예시
await sendEmail({
  to: 'studyleader@example.com',
  subject: '[AI 기초반] 이번 주 스터디 피드백 (2/3)',
  html: `
    <h2>안녕하세요! 이번 주도 스터디 운영 수고 많으셨어요 🙌</h2>

    <h3>설문 요약</h3>
    <p>긍정 9, 보통 2, 부정 1</p>

    <h3>눈여겨볼 피드백</h3>
    <p>"진행 속도가 조금 더 빨랐으면 좋겠어요"</p>

    <h3>원본 설문 데이터</h3>
    <ul>
      <li>응답 1: ...</li>
      <li>응답 2: ...</li>
    </ul>
  `,
});
```

---

## 확인 방법

터미널에서 테스트:

```bash
node -e "
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD }
});
transporter.verify().then(() => console.log('Gmail 연결 성공!')).catch(console.error);
"
```

---

## 문제 해결

| 증상 | 원인 | 해결 |
|------|------|------|
| "Invalid login" | 앱 비밀번호 잘못됨 | 비밀번호 재발급 |
| "Less secure app" | 일반 비밀번호 사용 시도 | 앱 비밀번호 사용 필수 |
| "EAUTH" | 2단계 인증 미설정 | 2단계 인증 먼저 활성화 |

---

## 보안 참고사항

- 앱 비밀번호는 **절대** 코드에 직접 입력하지 마세요
- 환경변수 또는 `.env` 파일 사용 권장
- `.env` 파일은 반드시 `.gitignore`에 추가

---

**예상 설정 시간**: 15-20분
