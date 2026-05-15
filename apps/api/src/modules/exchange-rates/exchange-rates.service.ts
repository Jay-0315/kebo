import { Injectable } from "@nestjs/common";
import { listExchangeRates } from "../shared/exchange-rate.util";

@Injectable()
export class ExchangeRatesService {
  findAll() {
    return listExchangeRates();
  }
}
