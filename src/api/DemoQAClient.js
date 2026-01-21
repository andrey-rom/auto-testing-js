import { runtimeConfig } from '../config/runtimeConfig.js';

export default class DemoQAClient {
  constructor(request) {
    this.request = request;
    this.baseUrl = runtimeConfig.baseUrl;
  }

  async createUser(userName, password) {
    const response = await this.request.post(`${this.baseUrl}/Account/v1/User`, {
      data: {
        userName: userName,
        password: password,
      },
    });
    return response;
  }

  async generateToken(userName, password) {
    const response = await this.request.post(`${this.baseUrl}/Account/v1/GenerateToken`, {
      data: {
        userName: userName,
        password: password,
      },
    });
    return response;
  }

  async getBooks() {
    const response = await this.request.get(`${this.baseUrl}/BookStore/v1/Books`);
    return response;
  }

  async addBooksToCollection(userId, token, collectionOfIsbns) {
    const response = await this.request.post(`${this.baseUrl}/BookStore/v1/Books`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        userId: userId,
        collectionOfIsbns: collectionOfIsbns,
      },
    });
    return response;
  }

  async deleteBook(userId, token, isbn) {
    const response = await this.request.delete(`${this.baseUrl}/BookStore/v1/Book`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        isbn: isbn,
        userId: userId,
      },
    });
    return response;
  }
}
