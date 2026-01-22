/**
 * API 응답 디버깅 테스트
 */

import axios from "axios";

const OC = "woongaro";

async function debugApi() {
  console.log("🔍 API 응답 디버깅...\n");

  try {
    // 법령 검색 API 직접 호출
    const url = `https://www.law.go.kr/DRF/lawSearch.do?OC=${OC}&target=law&type=XML&query=민법&display=3`;
    console.log("요청 URL:", url);

    const response = await axios.get(url, { timeout: 30000 });
    console.log("\n응답 상태:", response.status);
    console.log("\n응답 본문 (처음 1000자):\n");
    console.log(response.data.substring(0, 1000));
  } catch (error: any) {
    console.error("오류 발생:", error.message);
    if (error.response) {
      console.log("응답 상태:", error.response.status);
      console.log("응답 본문:", error.response.data);
    }
  }
}

debugApi();
