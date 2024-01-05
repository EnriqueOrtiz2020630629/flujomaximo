import "./TablaFlujos.css";

export default function TablaFlujos({flujos}) {
    const renderFlujos = () => {
        let fMax = 0;

        return flujos.map((flujo, indice) => {
            const flujoactual = fMax + flujo.flujo;
            fMax += flujo.flujo;
            return (
                <tr className="flujo-fila">
                    <td>{indice + 1}</td>
                    <td>{flujo.ruta}</td>
                    <td>{flujo.flujo}</td>
                    <td>{flujoactual}</td>
                </tr>
            );
        });
    };
    return (
        <div className="flujo-container">
            <table>
            <tr className="header-flujo">
                <td>Iteracion</td>
                <td>Ruta</td>
                <td>Flujo</td>
                <td>Flujo total</td>
            </tr>

            {renderFlujos()}
        </table>
        </div>
        
    );
}
