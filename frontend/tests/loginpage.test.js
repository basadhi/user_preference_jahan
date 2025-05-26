import { LoginPage } from "../components/loginpage.js";
import { authenticateUser } from "../components/utils/dataService.js";
import { applyPreferences } from "../components/forms/theme.js";


jest.mock("../views/utils/dataService", () => ({
  authenticateUser: jest.fn(),
}));

jest.mock("../views/forms/theme", () => ({
  applyPreferences: jest.fn(),
}));

describe("LoginPage", () => {
  let form;

  beforeEach(() => {
    webix.ui(LoginPage, webix.$$); 
    form = $$("login_page_form");
  });

  afterEach(() => {
    webix.ui().destructor(); 
    jest.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  test("form validation fails with empty inputs", () => {
    form.setValues({ email: "", password: "" });
    const isValid = form.validate();
    expect(isValid).toBe(false);
  });

  test("form validation fails with invalid email", () => {
    form.setValues({ email: "invalid-email", password: "123456" });
    const isValid = form.validate();
    expect(isValid).toBe(false);
  });

  test("successful login sets user data in storage and navigates", async () => {
    
    const user = {
      id: 1,
      email: "test@example.com",
      username: "testuser",
      firstName: "Test",
      lastName: "User",
      token: "abc123",
    };
    const preferences = {
      theme: "dark",
      font_family: "Arial",
      primary_color: "#333",
      animations_enabled: true,
    };
    authenticateUser.mockResolvedValue({ user, preferences });

    form.setValues({ email: "test@example.com", password: "password" });

    await form.callEvent("onItemClick", ["login"]); 

    expect(authenticateUser).toHaveBeenCalledWith("test@example.com", "password");
    expect(localStorage.getItem("loggedUser")).toContain("testuser");
    expect(localStorage.getItem("authToken")).toBe("abc123");
    expect(applyPreferences).toHaveBeenCalledWith(preferences);
  });

  test("invalid credentials show error", async () => {
    authenticateUser.mockResolvedValue("invalid_password");

    form.setValues({ email: "bad@example.com", password: "wrong" });

    await form.callEvent("onItemClick", ["login"]);

    expect(webix.message).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "error",
        text: "Invalid email or password.",
      })
    );
  });

  test("unregistered user redirects to signup", async () => {
    authenticateUser.mockResolvedValue(null);

    form.setValues({ email: "newuser@example.com", password: "password" });

    const modalboxSpy = jest.spyOn(webix, "modalbox").mockImplementation(() => {});
    await form.callEvent("onItemClick", ["login"]);

    expect(modalboxSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Not Registered",
      })
    );
  });
});
