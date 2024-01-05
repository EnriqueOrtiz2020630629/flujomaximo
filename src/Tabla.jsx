import { useState } from "react";
import "./Tabla.css";

function numeroALetra(num) {
    let resultado = "";

    while (num >= 0) {
        resultado = String.fromCharCode(65 + (num % 26)) + resultado;
        num = Math.floor(num / 26) - 1;
        if (num < 0) break;
    }

    return resultado;
}

const renderCabezaTabla = (longitud) => {
    return (
        <tr className="tabla-cabeza">
            <td className="cabeza-letra">De/A</td>
            {[...Array(longitud).keys()].map((indice) => {
                const letra = numeroALetra(indice);
                return <td classname="cabeza-letra" key={letra}>{letra}</td>;
            })}
        </tr>
    );
};

const bfs = (grafoResidual, s, t, padres) => {
    const numVertices = grafoResidual.length;
    const visitado = new Array(numVertices).fill(false);

    const cola = [];
    cola.push(s);
    visitado[s] = true;

    padres[s] = -1;

    while (cola.length > 0) {
        const u = cola.shift();
        for (let v = 0; v < numVertices; v++) {
            if (!visitado[v] && grafoResidual[u][v] > 0) {
                cola.push(v);
                padres[v] = u;
                visitado[v] = true;
            }
        }
    }
    return visitado[t];
};

const fordFulkerson = (grafo, s, t) => {
    let u, v;
    const numVertices = grafo.length;
    const grafoResidual = grafo.map((fila) => [...fila]);
    const padres = new Array(numVertices);
    const tablaFlujos = [];


    let flujoMax = 0;

    while (bfs(grafoResidual, s, t, padres)) {
        let pathFlow = Infinity;

        const path = [];

        for (v = t; v !== s; v = padres[v]) {
            path.push(v);
            u = padres[v];
            pathFlow = Math.min(pathFlow, grafoResidual[u][v]);
        }
        path.push(s);



        console.log("path", path);

        for (v = t; v !== s; v = padres[v]) {
            u = padres[v];
            grafoResidual[u][v] -= pathFlow;
            grafoResidual[v][u] += pathFlow;
        }

        console.log(pathFlow);

        flujoMax += pathFlow;

        tablaFlujos.push({
            "ruta": path.reverse().map(item => numeroALetra(item)),
            "flujo": pathFlow
        });
    }

    return tablaFlujos;
};

export default function Tabla({setFlujos}) {
    const [matrizAdj, setMatrizAdj] = useState([
        [0, 0],
        [0, 0],
    ]);


    const handleCambioCelda = (indX, indY, valor) => {
        setMatrizAdj((prev) => {
            const newMatriz = prev.map((fila, rowIndex) => {
                if (rowIndex === indY) {
                    return fila.map((valorCol, colIndex) =>
                        colIndex === indX ? parseInt(valor) : valorCol
                    );
                }
                return fila;
            });

            return newMatriz;
        });
    };

    const renderFilasTabla = (matriz) => {
        return matriz.map((nodo, ind_y) => {
            const letra = numeroALetra(ind_y);

            return (
                <tr className="fila-tabla">
                    <td className="letra-fila">{letra}</td>
                    {nodo.map((arco, ind_x) => (
                        <td>
                            <input
                            type="number"
                            size="1"
                                onChange={(e) =>
                                    handleCambioCelda(
                                        ind_x,
                                        ind_y,
                                        e.target.value
                                    )
                                }
                                value={arco}
                            />
                        </td>
                    ))}
                </tr>
            );
        });
    };

    const quitarFila = () => {
        setMatrizAdj((prev) => {
            const len = prev.length;

            if (len > 2) {
                return prev
                    .filter((fila, indice) => indice !== len - 1)
                    .map((fila) => fila.slice(0, -1));
            } else {
                return prev;
            }
        });
    };

    const agregarFila = () => {
        setMatrizAdj((prev) => {
            const len = prev.length;

            return [
                ...prev.map((fila) => [...fila, 0]),
                new Array(len + 1).fill(0),
            ];
        });
    };

    const calcular = () => {
        setFlujos(fordFulkerson(matrizAdj, 0, matrizAdj.length-1));
    }

    return (
        <div className="tabla-container">
            <div className="tabla-cont">
            <table className="tabla">
                {renderCabezaTabla(matrizAdj.length)}
                {renderFilasTabla(matrizAdj)}
            </table>
            </div>
            

            <div className="btn-container">
                <button className="btn-agregar" onClick={agregarFila}>+</button>
                <button className="btn-quitar" onClick={quitarFila}>-</button>
                <button className="btn-calcular" onClick={calcular}>Calcular</button>
            </div>
        </div>
    );
}
