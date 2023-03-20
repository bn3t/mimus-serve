import { myaxios } from "./test-utils";

describe("GROQ expression evaluation", () => {
  test("GROQ expression has been evaluated against the body - one ticket", async () => {
    const actual = await myaxios.get(
      "/tickets-groq/FB1B426A-3100-4949-A4CC-7F80A863FC3F",
    );
    expect(actual.status).toBe(200);
    expect(actual.data).toBeDefined();
    expect(actual.data.ticketId).toBe("FB1B426A-3100-4949-A4CC-7F80A863FC3F");
  });

  test("GROQ expression has been evaluated against the body - with a query parameter", async () => {
    const actual = await myaxios.get("/tickets-groq?status=OPEN");
    expect(actual.status).toBe(200);
    expect(actual.data).toBeDefined();
    expect(actual.data.length).toBe(10);
    expect(actual.data[0].ticketId).toBe(
      "A2BB9D48-E590-4988-8444-BDA9D4588B2E",
    );
  });

  test("GROQ expression has been evaluated against the body - all results", async () => {
    const actual = await myaxios.get("/tickets-groq");
    expect(actual.status).toBe(200);
    expect(actual.data).toBeDefined();
    expect(actual.data.length).toBe(27);
    expect(actual.data[0].ticketId).toBe(
      "FB1B426A-3100-4949-A4CC-7F80A863FC3F",
    );
  });
});
