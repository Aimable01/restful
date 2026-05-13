import swaggerJsDoc from "swagger-jsdoc";

export const specs = swaggerJsDoc({
  definition: {
    info: {
      title: "Parking system",
      version: "1.0.0",
    },
  },

  apis: ["./src/modules/**/*.ts"],
});
