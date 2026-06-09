import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import EmptyState from "../EmptyState";

describe("EmptyState", () => {
  it("muestra título y descripción", () => {
    render(
      <BrowserRouter>
        <EmptyState title="Sin resultados" description="No hay nada por aquí." />
      </BrowserRouter>
    );
    expect(screen.getByText("Sin resultados")).toBeInTheDocument();
    expect(screen.getByText("No hay nada por aquí.")).toBeInTheDocument();
  });

  it("renderiza botón de acción cuando se pasa onClick", () => {
    const onClick = vi.fn();
    render(
      <BrowserRouter>
        <EmptyState title="Vacío" description="Desc" action={{ label: "Crear", onClick }} />
      </BrowserRouter>
    );
    const btn = screen.getByText("Crear");
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("renderiza link cuando se pasa href en acción", () => {
    render(
      <BrowserRouter>
        <EmptyState title="Vacío" description="Desc" action={{ label: "Ir", href: "/explore" }} />
      </BrowserRouter>
    );
    const link = screen.getByRole("link", { name: "Ir" });
    expect(link).toHaveAttribute("href", "/explore");
  });
});
