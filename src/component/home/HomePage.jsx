import React, { useState } from "react";
import RoomResult from "../common/RoomResult";   // Componente que muestra los resultados de búsqueda
import RoomSearch from "../common/RoomSearch";   // Componente para buscar habitaciones

const HomePage = () => {

    // Estado para guardar los resultados de búsqueda
    const [roomSearchResults, setRoomSearchResults] = useState([]);

    // Función que se pasa a RoomSearch para actualizar los resultados
    const handleSearchResult = (results) => {
        setRoomSearchResults(results); // Al recibir resultados, actualiza el estado
    };

    return (
        <div className="home">
            {/*===========================*/}
            {/* HEADER / BANNER PRINCIPAL */}
            {/*===========================*/}
            <section>
                <header className="header-banner">
                    {/* Imagen de fondo del hotel */}
                    <img src="./assets/images/hotel.webp" alt="Roomly Stay" className="header-image" />
                    
                    {/* Overlay oscuro para mejorar legibilidad del texto */}
                    <div className="overlay"></div>

                    {/* Contenido animado sobre el overlay */}
                    <div className="animated-texts overlay-content">
                        <h1>
                            Bienvenido a <span className="roomlystay-color">Roomly Stay</span>
                        </h1><br />
                        <h3>Adéntrese en un remanso de comodidad y cuidado.</h3>
                    </div>
                </header>
            </section>

            {/*===========================*/}
            {/* SECCIÓN DE BÚSQUEDA */}
            {/*===========================*/}
            <RoomSearch handleSearchResult={handleSearchResult} />
            {/* Renderiza los resultados obtenidos de la búsqueda */}
            <RoomResult roomSearchResults={roomSearchResults} />

            {/* Enlace para ver todas las habitaciones */}
            <h4>
                <a className="view-rooms-home" href="/rooms">Todas las habitaciones</a>
            </h4>

            {/*===========================*/}
            {/* SECCIÓN DE SERVICIOS */}
            {/*===========================*/}
            <h2 className="home-services">
                Servicios en <span className="roomlystay-color">Roomly Stay</span>
            </h2>

            <section className="service-section">
                {/* Tarjeta de servicio: Aire acondicionado */}
                <div className="service-card">
                    <img src="./assets/images/ac.png" alt="Aire acondicionado" />
                    <div className="service-details">
                        <h3 className="service-title">Aire acondicionado</h3>
                        <p className="service-description">
                            Manténgase fresco y cómodo durante toda su estadía con nuestro aire acondicionado en la habitación controlado individualmente.
                        </p>
                    </div>
                </div>

                {/* Tarjeta de servicio: Minibar */}
                <div className="service-card">
                    <img src="./assets/images/mini-bar.png" alt="Minibar" />
                    <div className="service-details">
                        <h3 className="service-title">Minibar</h3>
                        <p className="service-description">
                            Disfrute de una cómoda selección de bebidas y refrigerios almacenados en el minibar de su habitación sin costo adicional.
                        </p>
                    </div>
                </div>

                {/* Tarjeta de servicio: Aparcamiento */}
                <div className="service-card">
                    <img src="./assets/images/parking.png" alt="Aparcamiento" />
                    <div className="service-details">
                        <h3 className="service-title">Aparcamiento</h3>
                        <p className="service-description">
                            Ofrecemos estacionamiento en el lugar para su comodidad. Consulte sobre las opciones de valet parking disponibles.
                        </p>
                    </div>
                </div>

                {/* Tarjeta de servicio: Wi-Fi */}
                <div className="service-card">
                    <img src="./assets/images/wifi.png" alt="Wi-Fi" />
                    <div className="service-details">
                        <h3 className="service-title">Wi-Fi</h3>
                        <p className="service-description">
                            Manténgase conectado durante toda su estadía con acceso Wi-Fi de alta velocidad gratuito disponible en todas las habitaciones y áreas públicas.
                        </p>
                    </div>
                </div>
            </section>

            {/*===========================*/}
            {/* SECCIÓN DE HABITACIONES DISPONIBLES */}
            {/*===========================*/}
            <section>
                {/* Por ahora vacío, ya que los resultados de búsqueda se muestran arriba */}
            </section>
        </div>
    );
}

export default HomePage;