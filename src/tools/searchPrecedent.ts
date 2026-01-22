/**
 * 판례 검색 도구
 */

import { z } from "zod";
import { LawApiClient } from "../utils/lawApiClient.js";

export const searchPrecedentSchema = z.object({
  query: z
    .string()
    .describe(
      '검색할 사건번호 또는 키워드 (예: "2020다12345", "손해배상 소멸시효")'
    ),
  page: z.number().optional().default(1).describe("결과 페이지 번호"),
  display: z.number().optional().default(10).describe("한 페이지당 결과 수"),
});

export type SearchPrecedentInput = z.infer<typeof searchPrecedentSchema>;

export async function searchPrecedent(
  client: LawApiClient,
  input: SearchPrecedentInput
): Promise<string> {
  const { query, page, display } = input;

  const precedents = await client.searchPrecedent(query, page, display);

  if (precedents.length === 0) {
    return `"${query}"에 대한 판례 검색 결과가 없습니다.`;
  }

  let output = `## 판례 검색 결과 (${precedents.length}건)\n\n`;

  precedents.forEach((prec, index) => {
    output += `### ${index + 1}. ${prec.caseName}\n`;
    output += `- **사건번호**: ${prec.caseNumber}\n`;
    output += `- **법원명**: ${prec.courtName}\n`;
    output += `- **선고일자**: ${prec.judgmentDate}\n`;
    output += `- **사건종류**: ${prec.caseType}\n`;
    output += `- **판결유형**: ${prec.judgmentType}\n`;
    if (prec.judgmentSummary) {
      output += `- **판례요지**: ${prec.judgmentSummary.substring(
        0,
        200
      )}...\n`;
    }
    output += `- **판례ID**: ${prec.precId}\n\n`;
  });

  return output;
}

export const getPrecedentDetailSchema = z.object({
  precId: z.string().describe("판례 ID (검색 결과에서 확인)"),
});

export type GetPrecedentDetailInput = z.infer<typeof getPrecedentDetailSchema>;

export async function getPrecedentDetail(
  client: LawApiClient,
  input: GetPrecedentDetailInput
): Promise<string> {
  const { precId } = input;
  return await client.getPrecedentDetail(precId);
}
