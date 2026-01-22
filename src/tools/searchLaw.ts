/**
 * 법령 검색 도구
 */

import { z } from "zod";
import { LawApiClient } from "../utils/lawApiClient.js";

export const searchLawSchema = z.object({
  query: z
    .string()
    .describe('검색할 법령명 또는 키워드 (예: "민법", "형법 제347조")'),
  page: z.number().optional().default(1).describe("결과 페이지 번호"),
  display: z.number().optional().default(10).describe("한 페이지당 결과 수"),
});

export type SearchLawInput = z.infer<typeof searchLawSchema>;

export async function searchLaw(
  client: LawApiClient,
  input: SearchLawInput
): Promise<string> {
  const { query, page, display } = input;

  const result = await client.searchLaw(query, page, display);

  if (result.laws.length === 0) {
    return `"${query}"에 대한 검색 결과가 없습니다.`;
  }

  let output = `## 법령 검색 결과 (총 ${result.totalCnt}건)\n\n`;

  result.laws.forEach((law, index) => {
    output += `### ${index + 1}. ${law.lawName}\n`;
    output += `- **법령ID**: ${law.lawId}\n`;
    output += `- **법령구분**: ${law.lawType}\n`;
    output += `- **공포일자**: ${law.proclamationDate}\n`;
    output += `- **시행일자**: ${law.enforcementDate}\n`;
    output += `- **소관부처**: ${law.department}\n\n`;
  });

  return output;
}

export const getLawDetailSchema = z.object({
  lawId: z.string().describe("법령 ID (검색 결과에서 확인)"),
});

export type GetLawDetailInput = z.infer<typeof getLawDetailSchema>;

export async function getLawDetail(
  client: LawApiClient,
  input: GetLawDetailInput
): Promise<string> {
  const { lawId } = input;
  return await client.getLawDetail(lawId);
}
