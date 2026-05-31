import swaggerJsDoc from "swagger-jsdoc";

export const specs = swaggerJsDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Parking system",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },

  apis: ["./src/modules/**/*.ts"],
});
