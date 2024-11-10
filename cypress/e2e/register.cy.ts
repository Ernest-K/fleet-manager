describe("User Registration", () => {
  it("registers a new user", () => {
    cy.visit("/auth");

    cy.contains("button", "Register").click();

    cy.get("input[name='firstName']").type("Test");
    cy.get("input[name='lastName']").type("User");
    cy.get("input[name='email']").type("testuser@example.com");
    cy.get("input[name='password']").type("password123");

    cy.get("button[type='submit']").click();

    cy.url().should("include", "/dashboard");
    cy.contains("Dashboard");
  });
});
