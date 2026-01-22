/**
 * 헌법재판소 결정 검색 도구
 */

import { z } from "zod";
import { LawApiClient } from "../utils/lawApiClient.js";

export const searchConstitutionalSchema = z.object({
  query: z
    .string()
    .describe(
      '검색할 사건번호 또는 키워드 (예: "2018헌마456", "과잉금지원칙")'
    ),
  page: z.number().optional().default(1).describe("결과 페이지 번호"),
  display: z.number().optional().default(10).describe("한 페이지당 결과 수"),
});

export type SearchConstitutionalInput = z.infer<
  typeof searchConstitutionalSchema
>;

export async function searchConstitutional(
  client: LawApiClient,
  input: SearchConstitutionalInput
): Promise<string> {
  const { query, page, display } = input;

  const decisions = await client.searchConstitutional(query, page, display);

  if (decisions.length === 0) {
    return `"${query}"에 대한 헌재 결정 검색 결과가 없습니다.`;
  }

  let output = `## 헌법재판소 결정 검색 결과 (${decisions.length}건)\n\n`;

  decisions.forEach((decision, index) => {
    output += `### ${index + 1}. ${decision.caseName}\n`;
    output += `- **사건번호**: ${decision.caseNumber}\n`;
    output += `- **선고일**: ${decision.decisionDate}\n`;
    output += `- **결정유형**: ${decision.decisionType}\n`;
    if (decision.decisionSummary) {
      output += `- **결정요지**: ${decision.decisionSummary.substring(
        0,
        200
      )}...\n`;
    }
    output += `- **결정ID**: ${decision.decisionId}\n\n`;
  });

  return output;
}

export const getConstitutionalDetailSchema = z.object({
  decisionId: z.string().describe("헌재 결정 ID (검색 결과에서 확인)"),
});

export type GetConstitutionalDetailInput = z.infer<
  typeof getConstitutionalDetailSchema
>;

export async function getConstitutionalDetail(
  client: LawApiClient,
  input: GetConstitutionalDetailInput
): Promise<string> {
  const { decisionId } = input;
  return await client.getConstitutionalDetail(decisionId);
}
