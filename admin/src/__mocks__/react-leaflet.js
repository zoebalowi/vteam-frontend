module.exports = {
  MapContainer: ({ children }) => <div>{children}</div>,
  TileLayer: () => <div>TileLayer</div>,
  Marker: ({ children }) => <div>Marker{children}</div>,
  Popup: ({ children }) => <div>Popup{children}</div>,
  useMap: () => ({ flyTo: () => {} }),
};
