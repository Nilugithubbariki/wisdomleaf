import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

const mockBranchData = [
  {
    products: [
      { name: 'Product A', unitPrice: 10.0, sold: 5 },
      { name: 'Product B', unitPrice: 15.0, sold: 3 },
      { name: 'Product C', unitPrice: 20.0, sold: 2 },
    ],
  },
  {
    products: [
      { name: 'Product B', unitPrice: 15.0, sold: 4 },
      { name: 'Product D', unitPrice: 12.0, sold: 6 },
    ],
  },
  {
    products: [
      { name: 'Product A', unitPrice: 10.0, sold: 2 },
      { name: 'Product D', unitPrice: 12.0, sold: 3 },
      { name: 'Product E', unitPrice: 18.0, sold: 4 },
    ],
  },
];

describe('App', () => {
  beforeEach(() => {
    jest.spyOn(window, 'fetch').mockImplementation((url) => {
      if (url.endsWith('branch1.json')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockBranchData[0].products),
        });
      }
      if (url.endsWith('branch2.json')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockBranchData[1].products),
        });
      }
      if (url.endsWith('branch3.json')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockBranchData[2].products),
        });
      }
      return Promise.reject(new Error('Invalid URL'));
    });
  });

  afterEach(() => {
    window.fetch.mockRestore();
  });

  test('renders table correctly', async () => {
    render(<App />);

    await screen.findByText('Product A');
    await screen.findByText('Product B');
    await screen.findByText('Product C');
    await screen.findByText('Product D');
    await screen.findByText('Product E');
  });

  test('filters table by product name', async () => {
    render(<App />);

    const searchInput = screen.getByLabelText('Search:');
    fireEvent.change(searchInput, { target: { value: 'B' } });

    expect(screen.queryByText('Product A')).not.toBeInTheDocument();
    expect(screen.queryByText('Product B')).toBeInTheDocument();
    expect(screen.queryByText('Product C')).not.toBeInTheDocument();
    expect(screen.queryByText('Product D')).not.toBeInTheDocument();
    expect(screen.queryByText('Product E')).not.toBeInTheDocument();
  });

  test('calculates total revenue correctly', async () => {
    render(<App />);

    await screen.findByText('$7,782.73');
  });

  test('displays "No products found." when no products match the filter', async () => {
    render(<App />);

    const searchInput = screen.getByLabelText('Search:');
    fireEvent.change(searchInput, { target: { value: 'X' } });

    await screen.findByText('No products found.');
  });
});
