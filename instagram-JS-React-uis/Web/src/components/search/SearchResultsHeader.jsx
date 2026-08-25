import './SearchResultsHeader.css';

function SearchResultsHeader({ query }) {
  return (
    <div className="search-results-header">
      <h2 className="search-results-header__query">
        {query || 'Ingrese un término de búsqueda'}
      </h2>
    </div>
  );
}

export default SearchResultsHeader;
