import React, { useState } from "react";
import RoomResult from "../common/RoomResult";
import RoomSearch from "../common/RoomSearch";

const HomePage = () => {

    const [roomSearchResults, setRoomSearchResults] = useState([]);

    // Function to handle search results
    const handleSearchResult = (results) => {
        setRoomSearchResults(results);
    };

    return (
        <div className="home">
            {/* HEADER / BANNER ROOM SECTION */}
            <section>
                <header className="header-banner">
                    <img src="./assets/images/hotel.webp" alt="Roomly Stay" className="header-image" />
                    <div className="overlay"></div>
                    <div className="animated-texts overlay-content">
                        <h1>
                            Bienvenido a <span className="roomlystay-color">Roomly Stay</span>
                        </h1><br />
                        <h3>Adéntrese en un remanso de comodidad y cuidado.</h3>
                    </div>
                </header>
            </section>

            {/* SEARCH/FIND AVAILABLE ROOM SECTION */}
            <RoomSearch handleSearchResult={handleSearchResult} />
            <RoomResult roomSearchResults={roomSearchResults} />

            <h4><a className="view-rooms-home" href="/rooms">Todas las habitaciones</a></h4>

            <h2 className="home-services">Servicios en <span className="roomlystay-color">Roomly Stay</span></h2>

            {/* SERVICES SECTION */}
            <section className="service-section"><div className="service-card">
                <img src="./assets/images/ac.png" alt="Aire acondicionado" />
                <div className="service-details">
                    <h3 className="service-title">Aire acondicionado</h3>
                    <p className="service-description">Manténgase fresco y cómodo durante toda su estadía con nuestro aire acondicionado en la habitación controlado individualmente.</p>
                </div>
            </div>
                <div className="service-card">
                    <img src="./assets/images/mini-bar.png" alt="Minibar" />
                    <div className="service-details">
                        <h3 className="service-title">Minibar</h3>
                        <p className="service-description">Disfrute de una cómoda selección de bebidas y refrigerios almacenados en el minibar de su habitación sin costo adicional.</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./assets/images/parking.png" alt="Aparcamiento" />
                    <div className="service-details">
                        <h3 className="service-title">Aparcamiento</h3>
                        <p className="service-description">Ofrecemos estacionamiento en el lugar para su comodidad. Consulte sobre las opciones de valet parking disponibles.</p>
                    </div>
                </div>
                <div className="service-card">
                    <img src="./assets/images/wifi.png" alt="Wi-Fi" />
                    <div className="service-details">
                        <h3 className="service-title">Wi-Fi</h3>
                        <p className="service-description">Manténgase conectado durante toda su estadía con acceso Wi-Fi de alta velocidad gratuito disponible en todas las habitaciones y áreas públicas.</p>
                    </div>
                </div>

            </section>
            {/* AVAILABLE ROOMS SECTION */}
            <section>

            </section>
        </div>
    );
}

export default HomePage;
