import { myaxios, resetDatasets } from "./test-utils";

describe("Datasets Tests - jsonata", () => {
  beforeEach(async () => {
    await resetDatasets();
  });

  test("get with dataset", async () => {
    const actual = await myaxios.get("/datasets/tickets");
    expect(actual.status).toBe(200);
    expect(actual.data).toBeDefined();
    expect(actual.data.length).toBe(27);
    expect(actual.data[0].ticketId).toBe(
      "FB1B426A-3100-4949-A4CC-7F80A863FC3F",
    );
  });

  test("get one ticket with datasets", async () => {
    const actual = await myaxios.get(
      "/datasets/tickets/FB1B426A-3100-4949-A4CC-7F80A863FC3F",
    );
    expect(actual.status).toBe(200);
    expect(actual.data).toBeDefined();
    expect(actual.data.ticketId).toBe("FB1B426A-3100-4949-A4CC-7F80A863FC3F");
  });

  test("update one ticket with datasets (PUT)", async () => {
    const actual = await myaxios.put(
      "/datasets/tickets/FB1B426A-3100-4949-A4CC-7F80A863FC3F",
      {
        ticketId: "FB1B426A-3100-4949-A4CC-7F80A863FC3F",
        message: "Updated message",
      },
    );
    expect(actual.status).toBe(200);
    expect(actual.data).toBeDefined();
    expect(actual.data.ticketId).toBe("FB1B426A-3100-4949-A4CC-7F80A863FC3F");
    expect(actual.data.message).toBe("Updated message");
    expect(actual.data.status).toBeUndefined();
    // optain the ticket again to verify the update
    const actual2 = await myaxios.get(
      "/datasets/tickets/FB1B426A-3100-4949-A4CC-7F80A863FC3F",
    );
    expect(actual2.status).toBe(200);
    expect(actual2.data).toBeDefined();
    expect(actual2.data.ticketId).toBe("FB1B426A-3100-4949-A4CC-7F80A863FC3F");
    expect(actual2.data.message).toBe("Updated message");
    expect(actual2.data.status).toBeUndefined();
  });

  test("update one ticket with datasets - id not in body (PUT)", async () => {
    const actual = await myaxios.put(
      "/datasets-no-id-in-body/tickets/FB1B426A-3100-4949-A4CC-7F80A863FC3F",
      {
        message: "Updated message",
      },
    );
    expect(actual.status).toBe(200);
    expect(actual.data).toBeDefined();
    expect(actual.data.ticketId).toBe("FB1B426A-3100-4949-A4CC-7F80A863FC3F");
    expect(actual.data.message).toBe("Updated message");
    expect(actual.data.status).toBe("CLOSED");
    // optain the ticket again to verify the update
    const actual2 = await myaxios.get(
      "/datasets/tickets/FB1B426A-3100-4949-A4CC-7F80A863FC3F",
    );
    expect(actual2.status).toBe(200);
    expect(actual2.data).toBeDefined();
    expect(actual2.data.ticketId).toBe("FB1B426A-3100-4949-A4CC-7F80A863FC3F");
    expect(actual2.data.message).toBe("Updated message");
    expect(actual2.data.status).toBe("CLOSED");
  });

  test("update one ticket with datasets (PATCH)", async () => {
    const actual = await myaxios.patch(
      "/datasets/tickets/FB1B426A-3100-4949-A4CC-7F80A863FC3F",
      {
        ticketId: "FB1B426A-3100-4949-A4CC-7F80A863FC3F",
        message: "Updated message",
      },
    );
    expect(actual.status).toBe(200);
    expect(actual.data).toBeDefined();

    expect(actual.data.ticketId).toBe("FB1B426A-3100-4949-A4CC-7F80A863FC3F");
    expect(actual.data.message).toBe("Updated message");
    expect(actual.data.status).toBe("CLOSED");

    // optain the ticket again to verify the update
    const actual2 = await myaxios.get(
      "/datasets/tickets/FB1B426A-3100-4949-A4CC-7F80A863FC3F",
    );
    expect(actual2.status).toBe(200);
    expect(actual2.data).toBeDefined();

    expect(actual2.data.ticketId).toBe("FB1B426A-3100-4949-A4CC-7F80A863FC3F");
    expect(actual2.data.message).toBe("Updated message");
    expect(actual2.data.status).toBe("CLOSED");
  });

  test("insert one ticket with datasets (POST)", async () => {
    const actual = await myaxios.post("/datasets/tickets", {
      status: "CLOSED",
      message: "Inserted ticket",
      type: "PREDICATE_ISSUE",
    });
    expect(actual.status).toBe(200);
    expect(actual.data).toBeDefined();
    expect(actual.data.message).toMatch(/^Inserted ticket.*/);

    const newTicketId = actual.data.ticketId;

    // optain the ticket again to verify the insert
    const actual2 = await myaxios.get(`/datasets/tickets/${newTicketId}`);
    expect(actual2.status).toBe(200);
    expect(actual2.data).toBeDefined();

    expect(actual2.data.ticketId).toBe(newTicketId);
    expect(actual2.data.message).toBe("Inserted ticket");
  });

  test("insert one ticket with datasets (POST) - response transformed", async () => {
    const actual = await myaxios.post(
      "/datasets/tickets-with-transform-response",
      {
        status: "CLOSED",
        message: "Inserted ticket",
        type: "PREDICATE_ISSUE",
      },
    );

    expect(actual.status).toBe(200);
    expect(actual.data).toBeDefined();
    expect(actual.data.id).toBeDefined();
    expect(actual.data.id).not.toBe("");
    expect(actual.data.message).toBeUndefined();

    const newTicketId = actual.data.id;

    // optain the ticket again to verify the insert
    const actual2 = await myaxios.get(`/datasets/tickets/${newTicketId}`);
    expect(actual2.status).toBe(200);
    expect(actual2.data).toBeDefined();

    expect(actual2.data.ticketId).toBe(newTicketId);
    expect(actual2.data.message).toBe("Inserted ticket");
  });

  test("delete one ticket with datasets (DELETE)", async () => {
    const actual = await myaxios.delete(
      "/datasets/tickets/FB1B426A-3100-4949-A4CC-7F80A863FC3F",
    );
    expect(actual.status).toBe(200);
    expect(actual.data).toBeDefined();
    expect(actual.data).toBe("OK");

    // optain the ticket again to verify the insert
    const actual2 = await myaxios.get(
      "/datasets/tickets/FB1B426A-3100-4949-A4CC-7F80A863FC3F",
    );
    expect(actual2.status).toBe(404);
  });
});
