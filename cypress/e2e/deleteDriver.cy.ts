describe("Delete Driver", () => {
  beforeEach(() => {
    cy.visit("/auth");
    cy.get("input[name='email']").type("testuser@example.com");
    cy.get("input[name='password']").type("password123");
    cy.get("button[type='submit']").contains("Sign in").click();
  });

  it("deletes a driver successfully", () => {
    cy.visit("/dashboard/drivers");

    cy.get("table").contains("td", "John").should("exist");

    cy.get("table").contains("td", "John").parent().find('button[aria-haspopup="menu"]').click();

    cy.contains("div[role='menuitem']", "Delete").click();

    cy.get("table").should("not.contain", "John");
    cy.get("table").should("not.contain", "Doe");
    cy.get("table").should("not.contain", "john.doe@example.com");
  });
});
