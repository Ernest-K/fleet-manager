describe("Create Vehicle", () => {
  beforeEach(() => {
    cy.visit("/auth");
    cy.get("input[name='email']").type("testuser@example.com");
    cy.get("input[name='password']").type("password123");
    cy.get("button[type='submit']").contains("Sign in").click();
  });

  it("creates a new vehicle", () => {
    cy.visit("/dashboard/vehicles/create");

    cy.get("button[role='combobox']").eq(0).click();
    cy.get("[role='option']").contains("Car").click();

    cy.get("button[role='combobox']").eq(1).click();
    cy.get("[role='option']").contains("Honda").click();

    cy.get("button[role='combobox']").eq(2).click();
    cy.get("[role='option']").contains("Civic").click();

    cy.get("button[role='combobox']").eq(3).click();
    cy.get("[role='option']").contains("2012").click();

    cy.get("button[role='combobox']").eq(4).click();
    cy.get("[role='option']").contains("Silver").click();

    cy.get("input[name='vin']").type("1HGCM82633A123456");
    cy.get("button[role='combobox']").eq(5).click();
    cy.get("[role='option']").contains("Gasoline").click();
    cy.get("input[name='odometerReading']").type("15000");
    cy.get("input[name='licensePlateNumber']").type("XYZ1234");
    cy.get("input[name='registration']").type("AB123456");

    cy.get('button[aria-haspopup="dialog"]').eq(0).click();
    cy.get('button[name="next-month"]').eq(0).click();
    cy.contains(".rdp", "15").click();

    cy.get('button[aria-haspopup="dialog"]').eq(1).click();
    cy.get('button[name="next-month"]').eq(1).click();
    cy.contains(".rdp", "15").click();

    cy.get("button[role='combobox']").eq(6).click();
    cy.get("[role='option']").contains("Active").click();

    cy.contains("button", "Create").click();

    // Don't know why user is logged out after adding a vehicle, only during testing
    cy.get("input[name='email']").type("testuser@example.com");
    cy.get("input[name='password']").type("password123");
    cy.get("button[type='submit']").contains("Sign in").click();
    cy.visit("/dashboard/vehicles");

    cy.get("table", { timeout: 10000 }).should("be.visible");
    cy.get("table").contains("td", "Honda");
    cy.get("table").contains("td", "Civic");
    cy.get("table").contains("td", "2012");
    cy.get("table").contains("td", "active");
  });
});
