describe("Create Assignment", () => {
  beforeEach(() => {
    cy.visit("/auth");
    cy.get("input[name='email']").type("testuser@example.com");
    cy.get("input[name='password']").type("password123");
    cy.get("button[type='submit']").contains("Sign in").click();
  });

  it("creates a new assignment", () => {
    cy.visit("/dashboard/assignments");
    cy.get("button").contains("Add assignment").click();

    cy.get("button[role='combobox']").eq(0).click();
    cy.get("[role='option']").eq(0).click();

    cy.get("button[role='combobox']").eq(1).click();
    cy.get("[role='option']").eq(0).click();

    cy.get('button[aria-haspopup="dialog"]').eq(1).click({ force: true });
    cy.get("button").contains("13").eq(0).click();
    cy.get("button").contains("17").eq(0).click();

    cy.contains("button", "Create").click();

    cy.get("table").should("be.visible");
    cy.get("table").contains("td", "13");
    cy.get("table").contains("td", "17");
  });
});

const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
Cypress.on("uncaught:exception", (err) => {
  /* returning false here prevents Cypress from failing the test */
  if (resizeObserverLoopErrRe.test(err.message)) {
    return false;
  }
});
