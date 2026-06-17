import URLBuilder from "@/utils/url.builder";

import { MapRequest } from "@/enums/request.enum";
import type {
  PathParams,
  QueryParams,
} from "@/interface/url.builder.interface";
import ApiService from "./httpClient.service";

class TemplateService extends ApiService {
  constructor() {
    super();
  }
  private buildUrl(
    path: string,
    pathParams?: PathParams,
    queryParams?: QueryParams,
  ): string {
    const urlBuilder = new URLBuilder(path, pathParams, queryParams);
    return urlBuilder.buildURL();
  }

  triggerGoogle() {
    return this.buildUrl(process.env.NEXT_PUBLIC_API_URL + "auth/google");
  }

  getProfileDetials() {
    const url = this.buildUrl("auth/profile");
    return this.request(MapRequest.get, url);
  }

  triggerZohoOAuth() {
    const url = this.buildUrl("zoho/oauth");
    return this.request(MapRequest.get, url);
  }

  revokeZohoOAuth() {
    const url = this.buildUrl("users/revoke/zoho");
    return this.request(MapRequest.get, url);
  }
}

const templateService = new TemplateService();
export default templateService;
