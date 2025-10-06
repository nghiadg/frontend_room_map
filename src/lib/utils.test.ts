import { cn } from "./utils";

describe("cn utility function", () => {
  it("should merge class names correctly", () => {
    const result = cn("class1", "class2");
    expect(result).toBe("class1 class2");
  });

  it("should handle conditional classes", () => {
    const result = cn("base", true && "conditional", false && "hidden");
    expect(result).toBe("base conditional");
  });

  it("should handle undefined and null values", () => {
    const result = cn("base", undefined, null, "valid");
    expect(result).toBe("base valid");
  });

  it("should handle empty strings", () => {
    const result = cn("base", "", "valid");
    expect(result).toBe("base valid");
  });

  it("should work with tailwind-merge", () => {
    // Test that conflicting classes are resolved correctly
    const result = cn("p-2", "p-4");
    expect(result).toBe("p-4"); // p-4 should override p-2
  });
});
