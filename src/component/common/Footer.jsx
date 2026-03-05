/**
 * FooterComponent
 * -----------------------------------------------------------------------------
 * Componente funcional React encargado de renderizar el footer de la aplicación.
 *
 * Responsabilidades principales:
 * - Mostrar información legal y de derechos reservados.
 * - Mostrar dinámicamente el año actual.
 * - Mantener consistencia visual con las variables de estilo globales (CSS).
 *
 * Estructura:
 * - <footer>: contenedor semántico HTML5 para el footer de la página.
 * - <span.my-footer>: aplica los estilos definidos en CSS para footer.
 *
 * Consideraciones:
 * - Se utiliza `new Date().getFullYear()` para mantener el año actualizado automáticamente.
 * - La clase `my-footer` aplica estilos como fondo, color de texto, padding, 
 *   centrado y posición fija en la parte inferior.
 */
const FooterComponent = () => {
    return (
        <footer>
            <span className="my-footer">
                Roomly Stay | Todos los derechos reservados &copy; {new Date().getFullYear()}
            </span>
        </footer>
    );
};

export default FooterComponent;
