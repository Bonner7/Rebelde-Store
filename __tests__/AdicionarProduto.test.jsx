// __tests__/AdicionarProduto.test.jsx
import React from "react";
import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import AdicionarProduto from "../src/app/AdicionarProduto/page"; // caminho correto

import { useRouter } from "next/navigation";
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  useRouter.mockReturnValue({
    push: jest.fn(),
    prefetch: jest.fn(),
  });
});

beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve([
        { id: 1, nome: "Blusas" },
        { id: 2, nome: "Calças" }
      ]),
    })
  );
});

describe("AdicionarProduto", () => {
  it("renderiza sem erros", async () => {
    render(<AdicionarProduto />);
    const categoria = await screen.findByText("Blusas");
    expect(categoria).toBeInTheDocument();
  });
});
