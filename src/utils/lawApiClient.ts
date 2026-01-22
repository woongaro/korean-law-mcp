/**
 * 국가법령정보센터 Open API 클라이언트
 * https://open.law.go.kr
 */

import axios, { AxiosInstance } from "axios";
import { XMLParser } from "fast-xml-parser";

const BASE_URL = "https://www.law.go.kr/DRF";

export interface LawSearchResult {
  totalCnt: number;
  laws: LawItem[];
}

export interface LawItem {
  lawId: string;
  lawName: string;
  lawType: string;
  proclamationDate: string;
  proclamationNumber: string;
  enforcementDate: string;
  department: string;
}

export interface PrecedentItem {
  precId: string;
  caseNumber: string;
  caseName: string;
  courtName: string;
  judgmentDate: string;
  caseType: string;
  judgmentType: string;
  judgmentSummary?: string;
}

export interface ConstitutionalItem {
  decisionId: string;
  caseNumber: string;
  caseName: string;
  decisionDate: string;
  decisionType: string;
  decisionSummary?: string;
}

export class LawApiClient {
  private client: AxiosInstance;
  private parser: XMLParser;
  private oc: string;

  constructor(oc: string) {
    this.oc = oc;
    this.client = axios.create({
      baseURL: BASE_URL,
      timeout: 30000,
    });
    this.parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });
  }

  /**
   * 법령 검색 (현행법령)
   */
  async searchLaw(
    query: string,
    page: number = 1,
    display: number = 10
  ): Promise<LawSearchResult> {
    try {
      const response = await this.client.get("/lawSearch.do", {
        params: {
          OC: this.oc,
          target: "eflaw", // 현행법령(시행일)
          type: "XML",
          query: query,
          page: page,
          display: display,
          nw: 3, // 현행법령만
        },
      });

      const parsed = this.parser.parse(response.data);
      const lawSearch = parsed.LawSearch || {};
      const totalCnt = parseInt(lawSearch.totalCnt || "0", 10);

      let laws: LawItem[] = [];
      if (lawSearch.law) {
        const lawArray = Array.isArray(lawSearch.law)
          ? lawSearch.law
          : [lawSearch.law];
        laws = lawArray.map((item: any) => ({
          lawId: item.법령ID || "",
          lawName: item.법령명한글 || "",
          lawType: item.법령구분명 || "",
          proclamationDate: item.공포일자 || "",
          proclamationNumber: item.공포번호 || "",
          enforcementDate: item.시행일자 || "",
          department: item.소관부처명 || "",
        }));
      }

      return { totalCnt, laws };
    } catch (error) {
      console.error("법령 검색 오류:", error);
      throw new Error(`법령 검색 중 오류가 발생했습니다: ${error}`);
    }
  }

  /**
   * 법령 상세 조회 (조문 포함)
   */
  async getLawDetail(lawId: string): Promise<string> {
    try {
      const response = await this.client.get("/lawService.do", {
        params: {
          OC: this.oc,
          target: "eflaw", // 현행법령(시행일)
          type: "XML",
          ID: lawId,
        },
      });

      const parsed = this.parser.parse(response.data);
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      console.error("법령 상세 조회 오류:", error);
      throw new Error(`법령 상세 조회 중 오류가 발생했습니다: ${error}`);
    }
  }

  /**
   * 판례 검색
   */
  async searchPrecedent(
    query: string,
    page: number = 1,
    display: number = 10
  ): Promise<PrecedentItem[]> {
    try {
      const response = await this.client.get("/lawSearch.do", {
        params: {
          OC: this.oc,
          target: "prec",
          type: "XML",
          query: query,
          page: page,
          display: display,
        },
      });

      const parsed = this.parser.parse(response.data);
      const precSearch = parsed.PrecSearch || {};

      let precedents: PrecedentItem[] = [];
      if (precSearch.prec) {
        const precArray = Array.isArray(precSearch.prec)
          ? precSearch.prec
          : [precSearch.prec];
        precedents = precArray.map((item: any) => ({
          precId: item.판례일련번호 || item.precId || "",
          caseNumber: item.사건번호 || item.caseNumber || "",
          caseName: item.사건명 || item.caseName || "",
          courtName: item.법원명 || item.courtName || "",
          judgmentDate: item.선고일자 || item.judgmentDate || "",
          caseType: item.사건종류명 || item.caseType || "",
          judgmentType: item.판결유형 || item.judgmentType || "",
          judgmentSummary: item.판례내용 || item.judgmentSummary || "",
        }));
      }

      return precedents;
    } catch (error) {
      console.error("판례 검색 오류:", error);
      throw new Error(`판례 검색 중 오류가 발생했습니다: ${error}`);
    }
  }

  /**
   * 판례 상세 조회
   */
  async getPrecedentDetail(precId: string): Promise<string> {
    try {
      const response = await this.client.get("/lawService.do", {
        params: {
          OC: this.oc,
          target: "prec",
          type: "XML",
          ID: precId,
        },
      });

      const parsed = this.parser.parse(response.data);
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      console.error("판례 상세 조회 오류:", error);
      throw new Error(`판례 상세 조회 중 오류가 발생했습니다: ${error}`);
    }
  }

  /**
   * 헌법재판소 결정 검색
   */
  async searchConstitutional(
    query: string,
    page: number = 1,
    display: number = 10
  ): Promise<ConstitutionalItem[]> {
    try {
      const response = await this.client.get("/lawSearch.do", {
        params: {
          OC: this.oc,
          target: "detc", // 헌재결정례
          type: "XML",
          query: query,
          page: page,
          display: display,
        },
      });

      const parsed = this.parser.parse(response.data);
      // API 응답 구조 확인을 위한 디버그
      const detcSearch = parsed.DetcSearch || parsed.detcSearch || {};

      let decisions: ConstitutionalItem[] = [];
      if (detcSearch.Detc) {
        const detcArray = Array.isArray(detcSearch.Detc)
          ? detcSearch.Detc
          : [detcSearch.Detc];
        decisions = detcArray.map((item: any) => ({
          decisionId: item.헌재결정례일련번호 || item["@_id"] || "",
          caseNumber: item.사건번호 || "",
          caseName: item.사건명 || "",
          decisionDate: item.종국일자 || "",
          decisionType: item.사건종류명 || "",
          decisionSummary: item.결정요지 || "",
        }));
      }

      return decisions;
    } catch (error) {
      console.error("헌재 결정 검색 오류:", error);
      throw new Error(`헌재 결정 검색 중 오류가 발생했습니다: ${error}`);
    }
  }

  /**
   * 헌재 결정 상세 조회
   */
  async getConstitutionalDetail(decisionId: string): Promise<string> {
    try {
      const response = await this.client.get("/lawService.do", {
        params: {
          OC: this.oc,
          target: "detc",
          type: "XML",
          ID: decisionId,
        },
      });

      const parsed = this.parser.parse(response.data);
      return JSON.stringify(parsed, null, 2);
    } catch (error) {
      console.error("헌재 결정 상세 조회 오류:", error);
      throw new Error(`헌재 결정 상세 조회 중 오류가 발생했습니다: ${error}`);
    }
  }
}
