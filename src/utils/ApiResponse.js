class ApiResponse {
  constructor(message, data) {
    this.message = message;
    this.status = "success";
    this.data = data;
  }
}

module.exports = { ApiResponse };
