import React from 'react';

const NetworkVisualization = ({ assets = [] }) => {
  return (
    <div style={{ padding: '10px', border: '1px solid #ccc' }}>
      <h3>Network Visualization</h3>
      {assets.length === 0 ? (
        <p>No assets available</p>
      ) : (
        <ul>
          {assets.map((asset, index) => (
            <li key={index}>
              {asset.asset_name || asset.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NetworkVisualization;
