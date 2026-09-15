// Single environment file (no fileReplacements) to keep the training setup simple.
// The Angular dev server runs on http://localhost:4200, the API on :3000.
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
