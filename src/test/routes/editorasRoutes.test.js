import { describe, expect, jest, test } from "@jest/globals";
import app from "../../app.js";
import request from "supertest";

let server;
beforeEach(() => {
  const port = 3000;
  server = app.listen(port);
});

afterEach(() => {
  server.close();
});

let idResposta;
describe("POST /editoras", () => {
  it("deve adicionar uma nova editora", async () => {
    const resposta = await request(app)
      .post("/editoras")
      .send({ nome: "CDC", cidade: "São Paulo", email: "s@s.com" })
      .expect(201);

    idResposta = resposta.body.content.id;
  });

  it("deve não adicionar uma nova editora quando body vazio", async () => {
    await request(app).post("/editoras").send({}).expect(400);
  });
});

describe("GET /editoras", () => {
  it("deve retornar uma lista de editoras", async () => {
    const resposta = await request(app)
      .get("/editoras")
      .set("Accept", "application/json")
      .expect("content-type", /json/)
      .expect(200);

    expect(resposta.body[0].email).toEqual("e@e.com");
  });
});

describe("GET /editoras/:id", () => {
  it("deve retornar uma editora selecionada", async () => {
    await request(app).get(`/editoras/${idResposta}`).expect(200);
  });
});

describe("PUT /editoras/:id", () => {
  test.each([
    { nome: "Casa do Código" },
    { cidade: "SP" },
    { email: "cdc@cdc.com" },
  ])("deve alterar o campo %s", async (param) => {
    const requisição = { request };
    const spy = jest.spyOn(requisição, "request");

    await requisição
      .request(app)
      .put(`/editoras/${idResposta}`)
      .send(param)
      .expect(204);

    expect(spy).toHaveBeenCalled();
  });
});

describe("DELETE /editoras/:id", () => {
  it("deve remover uma editora", async () => {
    await request(app)
      .delete(`/editoras/${idResposta}`)
      .send({ nome: "CDC", cidade: "São Paulo", email: "s@s.com" })
      .expect(200);
  });
});
