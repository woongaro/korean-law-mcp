import { LawApiClient } from "./utils/lawApiClient.js";
import * as dotenv from "dotenv";

dotenv.config();

const OC = process.env.LAW_API_OC || "woongaro";

async function searchInterpretation() {
  try {
    const axios = (await import("axios")).default;
    const { XMLParser } = await import("fast-xml-parser");
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });

    console.log("Searching for '지방교육재정과-6436'...");
    const response = await axios.get("https://www.law.go.kr/DRF/lawSearch.do", {
      params: {
        OC: OC,
        target: "expc",
        type: "XML",
        query: "지방교육재정과-6436",
        display: 10,
      },
    });

    const parsed = parser.parse(response.data);
    const expcSearch = parsed.ExpcSearch || parsed.expcSearch || {};
    const totalCnt = expcSearch.totalCnt || expcSearch["@_totalCnt"] || "0";
    console.log(`Total Count: ${totalCnt}`);

    if (expcSearch.expc) {
      const items = Array.isArray(expcSearch.expc)
        ? expcSearch.expc
        : [expcSearch.expc];
      items.forEach((item: any, index: number) => {
        console.log(
          `${index + 1}. [${item.회신일자}] ${item.제목} (${item.안건번호})`,
        );
        console.log(`   ID: ${item.법령해석일련번호}`);
      });
    } else {
      console.log("No results found in expc. Trying general search...");
      const response2 = await axios.get(
        "https://www.law.go.kr/DRF/lawSearch.do",
        {
          params: {
            OC: OC,
            target: "law", // Also try law target just in case
            type: "XML",
            query: "지방교육재정과-6436",
            display: 10,
          },
        },
      );
      const parsed2 = parser.parse(response2.data);
      console.log("General Search Total:", parsed2.LawSearch?.totalCnt || 0);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

searchInterpretation();
