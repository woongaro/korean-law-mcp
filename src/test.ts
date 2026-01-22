/**
 * 법령 API 테스트 스크립트
 */

import { LawApiClient } from "./utils/lawApiClient.js";
import * as dotenv from "dotenv";

dotenv.config();

const OC = process.env.LAW_API_OC || "woongaro";

async function testApi() {
  console.log("🔍 국가법령정보센터 API 테스트 시작...\n");

  const client = new LawApiClient(OC);

  try {
    // 1. 법령 검색 테스트
    console.log('1️⃣ 법령 검색 테스트: "민법"');
    const lawResult = await client.searchLaw("민법", 1, 3);
    console.log(`   - 총 ${lawResult.totalCnt}건 검색됨`);
    if (lawResult.laws.length > 0) {
      console.log(`   - 첫 번째 결과: ${lawResult.laws[0].lawName}`);
      console.log("   ✅ 법령 검색 성공!\n");
    }

    // 2. 판례 검색 테스트
    console.log('2️⃣ 판례 검색 테스트: "손해배상"');
    const precResult = await client.searchPrecedent("손해배상", 1, 3);
    if (precResult.length > 0) {
      console.log(`   - ${precResult.length}건 검색됨`);
      console.log(`   - 첫 번째 결과: ${precResult[0].caseName}`);
      console.log("   ✅ 판례 검색 성공!\n");
    } else {
      console.log("   ⚠️ 판례 검색 결과 없음\n");
    }

    // 3. 헌재 결정 검색 테스트
    console.log('3️⃣ 헌재 결정 검색 테스트: "위헌"');
    const constResult = await client.searchConstitutional("위헌", 1, 3);
    if (constResult.length > 0) {
      console.log(`   - ${constResult.length}건 검색됨`);
      console.log(`   - 첫 번째 결과: ${constResult[0].caseName}`);
      console.log("   ✅ 헌재 결정 검색 성공!\n");
    } else {
      console.log("   ⚠️ 헌재 결정 검색 결과 없음\n");
    }

    console.log("🎉 모든 API 테스트 완료!");
  } catch (error) {
    console.error("❌ 테스트 실패:", error);
  }
}

testApi();
