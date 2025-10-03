let API;

if (process.env.NODE_ENV === "development") {
  API = "http://localhost:5000/api/v1";
} else {
  API = "/api/v1";
}

export const server = API;



