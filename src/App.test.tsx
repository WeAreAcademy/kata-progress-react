import React from "react"
import { screen } from "@testing-library/react"
import { render } from "./test-utils"
import { App } from "./App"

test("renders Kata Progress link", () => {
  render(<App />)
  const linkElement = screen.getByText(/Kata Progress/i)
  expect(linkElement).toBeInTheDocument()
})
