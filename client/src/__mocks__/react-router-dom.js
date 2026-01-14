module.exports = {
  Link: ({ children }) => children,
  BrowserRouter: ({ children }) => children,
  Routes: ({ children }) => children,
  Route: ({ children }) => children,
  useNavigate: () => jest.fn(),
  useLocation: () => ({}),
};
