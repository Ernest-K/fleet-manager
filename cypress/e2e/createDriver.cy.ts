describe("Create Driver", () => {
  beforeEach(() => {
    cy.visit("/auth");
    cy.get("input[name='email']").type("testuser@example.com");
    cy.get("input[name='password']").type("password123");
    cy.get("button[type='submit']").contains("Sign in").click();
  });

  it("creates a new driver", () => {
    cy.visit("/dashboard/drivers/create");

    cy.get("input[name='firstName']").type("John");
    cy.get("input[name='lastName']").type("Doe");
    cy.get("input[name='phone']").type("1231231231");
    cy.get("input[name='licenseNumber']").type("ABC123456");

    cy.get("button[role='combobox']").click();

    cy.get("[role='option']").contains("Active").click();

    cy.get("input[name='email']").type("john.doe@example.com");
    cy.get("input[name='password']").type("password123");

    cy.contains("button", "Create").click();

    cy.get("table", { timeout: 10000 }).should("be.visible");
    cy.get("table").contains("td", "John");
    cy.get("table").contains("td", "Doe");
    cy.get("table").contains("td", "john.doe@example.com");
    cy.get("table").contains("td", "ABC123456");
    cy.get("table").contains("td", "active");
  });
});
