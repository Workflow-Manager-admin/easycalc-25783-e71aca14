import React from "react";
import { render, fireEvent, screen, within } from "@testing-library/react";
import Calculator from "./Calculator";

describe("EasyCalc Calculator", () => {
  function getDisplay() {
    return screen.getByTestId("display");
  }

  // Utility: click a sequence of buttons by label (string, e.g "12+3=", ["1","2","+","3","="])
  function clickButtons(buttons) {
    for (const label of buttons) {
      // Find by aria-label for accessibility support
      fireEvent.click(screen.getByRole("button", { name: label }));
    }
  }

  beforeEach(() => {
    render(<Calculator />);
  });

  it("renders calculator grid and display", () => {
    // All the main buttons and display should be present
    const expectedButtons = [
      "C", "÷", "×", "-", "7", "8", "9", "+",
      "4", "5", "6", "=", "1", "2", "3", "0", "."
    ];
    expect(getDisplay()).toBeInTheDocument();
    for (const btn of expectedButtons) {
      // for 0, button spans two columns but has single label
      if (btn === "0") {
        const zeroBtn = screen.getByRole("button", { name: btn });
        expect(zeroBtn).toBeInTheDocument();
        continue;
      }
      if (btn === "=") {
        const eqBtn = screen.getByRole("button", { name: btn });
        expect(eqBtn).toBeInTheDocument();
        continue;
      }
      expect(screen.getByRole("button", { name: btn })).toBeInTheDocument();
    }
  });

  it("shows 0 on initial display", () => {
    expect(getDisplay()).toHaveTextContent(/^0$/);
  });

  describe("Basic arithmetic operations", () => {
    it("performs addition correctly", () => {
      clickButtons(["2", "+", "3", "="]);
      expect(getDisplay()).toHaveTextContent("5");
    });

    it("performs subtraction correctly", () => {
      clickButtons(["7", "-", "4", "="]);
      expect(getDisplay()).toHaveTextContent("3");
    });

    it("performs multiplication correctly", () => {
      clickButtons(["5", "×", "6", "="]);
      expect(getDisplay()).toHaveTextContent("30");
    });

    it("performs division correctly", () => {
      clickButtons(["8", "÷", "2", "="]);
      expect(getDisplay()).toHaveTextContent("4");
    });

    it("handles consecutive operations (2 + 3 + 4 =)", () => {
      clickButtons(["2", "+", "3", "+", "4", "="]);
      // (2+3)=5, then 5+4=9
      expect(getDisplay()).toHaveTextContent("9");
    });

    it("handles long sequences: 1 + 2 × 3 =", () => {
      clickButtons(["1", "+", "2", "×", "3", "="]);
      // (1+2)=3, then 3×3=9 (as per simple left-to-right calculator logic; no precedence)
      expect(getDisplay()).toHaveTextContent("9");
    });

    it("handles pressing operators multiple times, using last one (5 + + 2 =)", () => {
      clickButtons(["5", "+", "+", "2", "="]);
      // It should act as one '+'
      expect(getDisplay()).toHaveTextContent("7");
    });
  });

  describe("Clear/reset functionality", () => {
    it("restores display and state to 0 after pressing C", () => {
      clickButtons(["9", "÷", "3", "C"]);
      expect(getDisplay()).toHaveTextContent("0");
      // Next input starts fresh
      clickButtons(["4"]);
      expect(getDisplay()).toHaveTextContent("4");
    });

    it("resets error state after C", () => {
      clickButtons(["5", "÷", "0", "="]);
      expect(getDisplay()).toHaveTextContent("Err");
      clickButtons(["C"]);
      expect(getDisplay()).toHaveTextContent("0");
    });
  });

  describe("Equals and result display", () => {
    it("shows correct result after pressing =", () => {
      clickButtons(["3", "×", "7", "="]);
      expect(getDisplay()).toHaveTextContent("21");
    });

    it("allows continued calculation after result", () => {
      clickButtons(["3", "+", "3", "="]);
      expect(getDisplay()).toHaveTextContent("6");
      clickButtons(["+", "4", "="]);
      expect(getDisplay()).toHaveTextContent("10");
    });

    it("starts new input after result", () => {
      clickButtons(["6", "-", "1", "="]); // 5
      clickButtons(["2"]);
      expect(getDisplay()).toHaveTextContent("2");
    });
  });

  describe("Input and UI interaction", () => {
    it("updates display on digit button presses", () => {
      clickButtons(["2", "4", "1"]);
      expect(getDisplay()).toHaveTextContent("241");
    });

    it("handles leading zero and decimal point", () => {
      clickButtons(["0", ".", "7"]);
      expect(getDisplay()).toHaveTextContent("0.7");
    });

    it("prevents multiple decimals in one number", () => {
      clickButtons(["1", ".", ".", "5", "."]);
      expect(getDisplay()).toHaveTextContent("1.5");
    });

    it("allows negative results (2 - 5 =)", () => {
      clickButtons(["2", "-", "5", "="]);
      expect(getDisplay()).toHaveTextContent("-3");
    });

    it("rejects starting with operator: just pressing + should not change 0", () => {
      clickButtons(["+"]);
      expect(getDisplay()).toHaveTextContent("0");
    });
  });

  describe("Edge cases", () => {
    it("shows Err when dividing by zero", () => {
      clickButtons(["8", "÷", "0", "="]);
      expect(getDisplay()).toHaveTextContent("Err");
    });

    it("does not throw for mostly empty or utility button presses", () => {
      clickButtons(["C"]);
      expect(getDisplay()).toHaveTextContent("0");
      clickButtons(["="]);
      expect(getDisplay()).toHaveTextContent("0");
    });

    it("can recover from error and start again", () => {
      clickButtons(["6", "÷", "0", "="]);
      expect(getDisplay()).toHaveTextContent("Err");
      clickButtons(["8", "+", "2", "="]);
      expect(getDisplay()).toHaveTextContent("10");
    });

    it("can handle pressing operator after '=' reusing last result", () => {
      clickButtons(["7", "+", "2", "="]); // 9
      clickButtons(["×", "3", "="]);
      expect(getDisplay()).toHaveTextContent("27");
    });

    it("handles 0 . . . correctly as 0.", () => {
      clickButtons(["0", ".", ".", "."]);
      expect(getDisplay()).toHaveTextContent("0.");
    });

    it("handles multiple zeroes properly (0 0 1)", () => {
      clickButtons(["0", "0", "1"]);
      expect(getDisplay()).toHaveTextContent("1");
    });
  });

  describe("Accessibility and focus", () => {
    it("buttons are accessible by aria-label", () => {
      for (const btn of ["1", "2", "3", "+", "-", "×", "÷", "C", "=", "0", "."]) {
        expect(screen.getByRole("button", { name: btn })).toBeInTheDocument();
      }
    });

    it("calculator display is accessible", () => {
      expect(getDisplay()).toHaveAttribute("data-testid", "display");
    });
  });
});
