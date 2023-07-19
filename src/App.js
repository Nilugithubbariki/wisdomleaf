import React, { useEffect, useState } from 'react';
import "./App.css"
const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(number);
};

const App = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');


  const sortAscending = () => {
    const sortedData = [...data].sort((a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase())
    );
    setData(sortedData);
    setFilteredData(sortedData);
  };
  const sortDescending = () => {
    const sortedData = [...data].sort((a, b) =>
      b.name.toLowerCase().localeCompare(a.name.toLowerCase())
    );
    setData(sortedData);
    setFilteredData(sortedData);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchPromises = [1, 2, 3].map((branch) =>
          fetch(`${window.location.origin}/branch${branch}.json`)
            .then((response) => response.json())
        );
        const branchData = await Promise.all(branchPromises);
        const mergedData = mergeBranchData(branchData);
        setData(mergedData);
        setFilteredData(mergedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
      }
    };
  
    fetchData();
  }, []);  

  const mergeBranchData = (branchData) => {
    const mergedData = [];
    branchData?.forEach((branch) => {
      branch?.products?.forEach((product) => {
        const existingProduct = mergedData.find(
          (p) => p.name === product.name
        );
        if (existingProduct) {
          existingProduct.totalRevenue = (product.unitPrice * product.sold);
        } else {
          mergedData.push(product);
        }
      });
    });
    return mergedData;
  };

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
    const filteredData = data.filter((product) =>
      product.name.toLowerCase().includes(searchTerm)
    );
    setFilteredData(filteredData);
  };

  const calculateTotalRevenue = () => {
    return filteredData.reduce(
      (total, product) => total + product.totalRevenue,
      0
    );
  };

  const renderTable = () => {
    if (filteredData.length === 0) {
      return <p>Loading...</p>;
    }

    return (
      <>
      <div className='divStyle'>
      <button onClick={sortAscending }>Ascending</button>
      <button onClick={sortDescending}>Descending</button>
      </div>
      <div className='styleContainer'>
        <table style={{ background: "black" }}>
          <thead style={{ background: "grey" }}>
            <tr>
              <th>Product Name</th>
              <th>Total Revenue</th>
            </tr>
          </thead>
          <tbody style={{ background: "lightgrey" }}>
            {filteredData.map((product, index) => (
              <tr key={index}>
                {console.log(product)}
                <td>{product.name}</td>
                <td>{formatNumber(product.totalRevenue)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td>Total Revenue:</td>
              <td>{formatNumber(calculateTotalRevenue())}</td>
            </tr>
          </tfoot>
        </table>
      </div></>
    );
  };

  return (
    <div>
      <label htmlFor="search">Search:</label>
      <input
        type="text"
        id="search"
        value={searchTerm}
        onChange={handleSearch}
        placeholder='Search Here...'
        className='styleInput'
        autoComplete='off'
      />
      {renderTable()}
    </div>
  );
};

export default App;
