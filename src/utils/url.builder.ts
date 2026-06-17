import { PathParams, QueryParams } from "../interface/url.builder.interface";


class URLBuilder {
  private baseUrl: string;
  private pathParams?: PathParams;
  private queryParams?: QueryParams;

  constructor(
    baseUrl: string,
    pathParams?: PathParams,
    queryParams?: QueryParams,
  ) {
    this.baseUrl = baseUrl;
    this.pathParams = pathParams;
    this.queryParams = queryParams;
  }

  replacePathParams(): string {
    let pathUrl = this.baseUrl;

    if (this.pathParams) {
      for (const [key, value] of Object.entries(this.pathParams)) {
        pathUrl = pathUrl.replace(
          new RegExp(`/:${key}(?=/|$)`, "g"),
          `/${encodeURIComponent(String(value))}`,
        );
      }
    }

    pathUrl = pathUrl.replace(/\/:[^/]+/g, "");
    return pathUrl;
  }

  buildQueryString(): string {
    if (!this.queryParams) return "";
    return Object.entries(this.queryParams)
      .filter(([, value]) => value !== undefined)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
      )
      .join("&");
  }

  public buildURL(): string {
    const pathUrl = this.replacePathParams();
    const queryString = this.buildQueryString();
    return queryString ? `${pathUrl}?${queryString}` : pathUrl;
  }
}

export default URLBuilder;
