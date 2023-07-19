import React, { useEffect, useState } from 'react';

const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(number);
};

const BranchData = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const branchPromises = [1, 2, 3].map((branch) =>
          fetch(`api/branch${branch}.json`).then((response) =>
            response.json()
          )
        );
        const branchData = await Promise.all(branchPromises);
        const mergedData = mergeBranchData(branchData);
        setData(mergedData);
        setFilteredData(mergedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const mergeBranchData = (branchData) => {
    const mergedData = [];
    branchData.forEach((branch) => {
      branch.forEach((product) => {
        const existingProductIndex = mergedData.findIndex(
          (p) => p.name === product.name
        );
        if (existingProductIndex !== -1) {
          mergedData[existingProductIndex].totalRevenue +=
            product.totalRevenue;
        } else {
          mergedData.push(product);
        }
      });
    });
    return mergedData.sort((a, b) => a.name.localeCompare(b.name));
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
      return <p>No products found.</p>;
    }

    return (
      <table>
        <thead>
          <tr>
            <th>Product Name</th>
            <th>Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((product, index) => (
            <tr key={index}>
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
      />
      {renderTable()}
    </div>
  );
};

export default BranchData;
