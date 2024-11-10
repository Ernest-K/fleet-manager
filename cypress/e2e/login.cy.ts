describe("User Login", () => {
  it("logs in an existing user", () => {
    cy.visit("/auth");

    cy.get("input[name='email']").type("testuser@example.com");
    cy.get("input[name='password']").type("password123");

    cy.get("button[type='submit']").contains("Sign in").click();

    cy.url().should("include", "/dashboard");
    cy.contains("Dashboard");
  });
});
