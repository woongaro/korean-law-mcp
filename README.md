# 🇰🇷 Korean Law MCP Server

대한민국 법령, 판례, 헌법재판소 결정을 검색할 수 있는 MCP(Model Context Protocol) 서버입니다.

## 📋 제공 도구

| 도구명 | 설명 | 데이터 출처 |
|--------|------|------------|
| `search_korean_law` | 현행 법령 검색 | 국가법령정보센터 |
| `get_law_detail` | 법령 상세 조회 (조문 포함) | 국가법령정보센터 |
| `search_precedent` | 대법원/하급심 판례 검색 | 국가법령정보센터 |
| `get_precedent_detail` | 판례 상세 조회 | 국가법령정보센터 |
| `search_constitutional` | 헌법재판소 결정 검색 | 국가법령정보센터 |
| `get_constitutional_detail` | 헌재 결정 상세 조회 | 국가법령정보센터 |

## 🚀 설치 및 설정

### 1. API 키 발급

> ⚠️ **필수**: 국가법령정보센터 Open API 사용을 위해 API 키가 필요합니다.

1. [국가법령정보 공동활용](https://open.law.go.kr) 접속
2. 회원가입
3. 공동활용 데이터 선택 → 활용 신청
4. **IP 주소 등록** (사용하는 컴퓨터의 공인 IP 등록 필수)
5. 승인 완료 (1~2일 소요)

### 2. 의존성 설치

```bash
cd korean-law-mcp
npm install
```

### 3. 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일을 열고 가입 시 사용한 이메일 ID 입력:

```
LAW_API_OC=your_email_id
```

### 4. 빌드 및 실행

```bash
npm run build
npm start
```

## 🔧 MCP 클라이언트 설정

MCP 호환 클라이언트(Antigravity, Claude Desktop 등)에서 설정이 필요합니다.

### Claude Desktop

`~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "korean-law": {
      "command": "node",
      "args": ["/path/to/korean-law-mcp/dist/index.js"],
      "env": {
        "LAW_API_OC": "your_email_id"
      }
    }
  }
}
```

### Antigravity / 기타 MCP 클라이언트

해당 클라이언트의 MCP 서버 설정에 동일한 구성을 추가하세요.

## 📖 사용 예시

### 법령 검색

```
민법 제750조 불법행위 조문을 찾아줘
근로기준법에서 해고 관련 조문을 검색해줘
```

### 판례 검색

```
손해배상 소멸시효 관련 대법원 판례를 검색해줘
2020다12345 판례를 찾아줘
```

### 헌재 결정 검색

```
양심적 병역거부 관련 헌재 결정을 찾아줘
과잉금지원칙 위반 결정례를 검색해줘
```

## 🔍 API 상세 정보

### 법령 검색 파라미터

| 파라미터 | 설명 | 예시 |
|----------|------|------|
| query | 검색 키워드 | "민법", "근로기준법" |
| nw | 법령 상태 | 1:연혁, 2:시행예정, 3:현행 |
| sort | 정렬 | lasc, ldes, dasc, ddes |

### 판례 검색 파라미터

| 파라미터 | 설명 | 예시 |
|----------|------|------|
| query | 검색 키워드 | "손해배상", "불법행위" |
| curt | 법원명 | "대법원", "서울고등법원" |
| org | 법원종류 | 400201:대법원, 400202:하위법원 |

### 헌재 결정 검색 파라미터

| 파라미터 | 설명 | 예시 |
|----------|------|------|
| query | 검색 키워드 | "위헌", "과잉금지" |
| sort | 정렬 | lasc, ddes, nasc |

## 📜 라이선스

MIT License

## 🙏 데이터 출처

- [국가법령정보센터](https://www.law.go.kr) - 법제처
- [국가법령정보 공동활용](https://open.law.go.kr) - Open API
