import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  postCoin(data: any) {
    return this.http.post<any>("http://localhost:3000/coins/", data)
  }

  getListCoin() {
    return this.http.get<any>("https://min-api.cryptocompare.com/data/all/coinlist");
  }
  getCoin() {
    return this.http.get<any>("http://localhost:3000/coins/");
  }

  putCoin(data: any, id: number) {
    return this.http.put<any>("http://localhost:3000/coins/" + id, data);
  }

  deleteCoin(id: number) {
    return this.http.delete<any>("http://localhost:3000/coins/" + id)
  }

  getPortfolios() {
    return this.http.get<any>("http://localhost:3000/portfolios/");
  }

  async getPortfoliosWithLines(portfolioId: string): Promise<any> {
    try {
      let response = await this.http
        .get("http://localhost:3000/portfolios/" + portfolioId + "?_embed=lines")
        .toPromise();
      return response;
    } catch (error) {
      await console.log(error);
    }
  }

  postPortfolio(data: any) {
    return this.http.post<any>("http://localhost:3000/portfolios/", data)
  }

  putPortfolio(data: any, id: number) {
    return this.http.put<any>("http://localhost:3000/portfolios/" + id, data);
  }

  deletePortfolio(id: number) {
    return this.http.delete<any>("http://localhost:3000/portfolios/" + id)
  }

  postPortfolioLine(id: number, data: any) {
    //TODO: añade la linea pero al persistir el id del portfolio como string ejemplo "1", luego no sale en la tabla
    return this.http.post<any>("http://localhost:3000/portfolios/" + id + "/lines", data)
  }

  putPortfolioLine(portfolioId: string, data: any, id: number) {
    //TODO: me da un error de not found, aunque en teoria esta bien la url
    return this.http.put<any>("http://localhost:3000/portfolios/" + portfolioId + "/lines/" + id, data);
  }

  deletePortfolioLine(portfolioId: string, id: number) {
    //TODO: me da un error de not found, aunque en teoria esta bien la url
    return this.http.delete<any>("http://localhost:3000/portfolios/" + portfolioId + "/lines/" + id)
  }


}
