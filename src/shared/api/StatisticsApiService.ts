import { StatisticsApi } from "@russian-rs/portal-api-axios";
import { RequestHttp } from "src/shared/http/RequestHttp";

export const StatisticsApiService = new StatisticsApi(
    undefined,
    undefined,
    RequestHttp
);


