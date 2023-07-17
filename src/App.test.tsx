import { screen } from "@testing-library/react";
import { App } from "./App";
import { render } from "./test-utils";

test("renders Kata Progress link", () => {
    render(<App />);
    const el = screen.getByText(/Kata Progress/i);
    expect(el).toBeInTheDocument();
});
