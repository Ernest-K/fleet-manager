describe("Delete Vehicle", () => {
  beforeEach(() => {
    cy.visit("/auth");
    cy.get("input[name='email']").type("testuser@example.com");
    cy.get("input[name='password']").type("password123");
    cy.get("button[type='submit']").contains("Sign in").click();
  });

  it("deletes a vehicle successfully", () => {
    cy.visit("/dashboard/vehicles");

    cy.get("table").contains("td", "Honda").should("exist");

    cy.get("table").contains("td", "Honda").parent().find('button[aria-haspopup="menu"]').click();

    cy.contains("div[role='menuitem']", "Delete").click();

    cy.get("table").should("not.contain", "Honda");
    cy.get("table").should("not.contain", "Civic");
  });
});
