#!/usr/bin/env node

/**
 * 대한민국 법률 정보 MCP 서버
 * 국가법령정보센터 Open API를 활용한 법령/판례/헌재결정 검색
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";

import { LawApiClient } from "./utils/lawApiClient.js";
import {
  searchLaw,
  searchLawSchema,
  getLawDetail,
  getLawDetailSchema,
} from "./tools/searchLaw.js";
import {
  searchPrecedent,
  searchPrecedentSchema,
  getPrecedentDetail,
  getPrecedentDetailSchema,
} from "./tools/searchPrecedent.js";
import {
  searchConstitutional,
  searchConstitutionalSchema,
  getConstitutionalDetail,
  getConstitutionalDetailSchema,
} from "./tools/searchConstitutional.js";

// 환경 변수에서 API 키 로드
const LAW_API_OC = process.env.LAW_API_OC;

if (!LAW_API_OC) {
  console.error("❌ LAW_API_OC 환경 변수가 설정되지 않았습니다.");
  console.error(
    "   https://open.law.go.kr 에서 API 활용 신청 후 이메일 ID를 설정하세요."
  );
  process.exit(1);
}

const apiClient = new LawApiClient(LAW_API_OC);

// MCP 서버 생성
const server = new Server(
  {
    name: "korean-law-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// 도구 목록 정의
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_korean_law",
        description:
          "대한민국 법령을 검색합니다. 법령명이나 키워드로 현행 법률, 시행령, 시행규칙 등을 조회할 수 있습니다.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description:
                '검색할 법령명 또는 키워드 (예: "민법", "형법 제347조")',
            },
            page: {
              type: "number",
              description: "결과 페이지 번호 (기본값: 1)",
            },
            display: {
              type: "number",
              description: "한 페이지당 결과 수 (기본값: 10)",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_law_detail",
        description: "특정 법령의 상세 내용(조문 포함)을 조회합니다.",
        inputSchema: {
          type: "object",
          properties: {
            lawId: {
              type: "string",
              description: "법령 ID (search_korean_law 결과에서 확인)",
            },
          },
          required: ["lawId"],
        },
      },
      {
        name: "search_precedent",
        description:
          "대법원 판례를 검색합니다. 사건번호나 키워드로 판례를 조회할 수 있습니다.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description:
                '검색할 사건번호 또는 키워드 (예: "2020다12345", "손해배상 소멸시효")',
            },
            page: {
              type: "number",
              description: "결과 페이지 번호 (기본값: 1)",
            },
            display: {
              type: "number",
              description: "한 페이지당 결과 수 (기본값: 10)",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_precedent_detail",
        description:
          "특정 판례의 상세 내용(판시사항, 판결요지 포함)을 조회합니다.",
        inputSchema: {
          type: "object",
          properties: {
            precId: {
              type: "string",
              description: "판례 ID (search_precedent 결과에서 확인)",
            },
          },
          required: ["precId"],
        },
      },
      {
        name: "search_constitutional",
        description:
          "헌법재판소 결정을 검색합니다. 사건번호나 키워드로 헌재 결정례를 조회할 수 있습니다.",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description:
                '검색할 사건번호 또는 키워드 (예: "2018헌마456", "과잉금지원칙")',
            },
            page: {
              type: "number",
              description: "결과 페이지 번호 (기본값: 1)",
            },
            display: {
              type: "number",
              description: "한 페이지당 결과 수 (기본값: 10)",
            },
          },
          required: ["query"],
        },
      },
      {
        name: "get_constitutional_detail",
        description:
          "특정 헌재 결정의 상세 내용(결정요지, 주문 포함)을 조회합니다.",
        inputSchema: {
          type: "object",
          properties: {
            decisionId: {
              type: "string",
              description: "헌재 결정 ID (search_constitutional 결과에서 확인)",
            },
          },
          required: ["decisionId"],
        },
      },
    ],
  };
});

// 도구 실행 핸들러
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "search_korean_law": {
        const input = searchLawSchema.parse(args);
        const result = await searchLaw(apiClient, input);
        return { content: [{ type: "text", text: result }] };
      }
      case "get_law_detail": {
        const input = getLawDetailSchema.parse(args);
        const result = await getLawDetail(apiClient, input);
        return { content: [{ type: "text", text: result }] };
      }
      case "search_precedent": {
        const input = searchPrecedentSchema.parse(args);
        const result = await searchPrecedent(apiClient, input);
        return { content: [{ type: "text", text: result }] };
      }
      case "get_precedent_detail": {
        const input = getPrecedentDetailSchema.parse(args);
        const result = await getPrecedentDetail(apiClient, input);
        return { content: [{ type: "text", text: result }] };
      }
      case "search_constitutional": {
        const input = searchConstitutionalSchema.parse(args);
        const result = await searchConstitutional(apiClient, input);
        return { content: [{ type: "text", text: result }] };
      }
      case "get_constitutional_detail": {
        const input = getConstitutionalDetailSchema.parse(args);
        const result = await getConstitutionalDetail(apiClient, input);
        return { content: [{ type: "text", text: result }] };
      }
      default:
        throw new Error(`알 수 없는 도구: ${name}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return {
      content: [{ type: "text", text: `오류 발생: ${errorMessage}` }],
      isError: true,
    };
  }
});

// 서버 시작
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("🇰🇷 대한민국 법률 정보 MCP 서버가 시작되었습니다.");
}

main().catch((error) => {
  console.error("서버 시작 실패:", error);
  process.exit(1);
});
