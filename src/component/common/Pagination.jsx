import React from 'react';

/**
 * Componente de Paginación
 * ------------------------
 * Muestra los botones de paginación para navegar entre páginas de habitaciones.
 * 
 * Props:
 * - roomsPerPage: número de habitaciones por página
 * - totalRooms: total de habitaciones disponibles
 * - currentPage: página actualmente seleccionada
 * - paginate: función que se ejecuta al hacer clic en un número de página
 */
const Pagination = ({ roomsPerPage, totalRooms, currentPage, paginate }) => {
  const pageNumbers = [];

  // Calculamos la cantidad total de páginas necesarias
  for (let i = 1; i <= Math.ceil(totalRooms / roomsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className='pagination-nav'>
      {/* Lista de números de página */}
      <ul className="pagination-ul">
        {pageNumbers.map((number) => (
          <li key={number} className="pagination-li">
            {/* 
              Botón de página
              - Llama a la función paginate con el número de página seleccionado
              - Agrega clase 'current-page' si es la página actual
            */}
            <button
              onClick={() => paginate(number)}
              className={`pagination-button ${currentPage === number ? 'current-page' : ''}`}
            >
              {number}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Pagination;