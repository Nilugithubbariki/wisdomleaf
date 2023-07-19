import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import BranchData from './BranchData';

const mockData = [
  { name: 'Product A', totalRevenue: 100 },
  { name: 'Product B', totalRevenue: 200 },
  { name: 'Product C', totalRevenue: 300 },
];

describe('BranchData', () => {
  beforeEach(() => {
    jest.spyOn(window, 'fetch').mockImplementation((url) => {
      if (url.endsWith('branch1.json')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockData),
        });
      }
      if (url.endsWith('branch2.json')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockData),
        });
      }
      if (url.endsWith('branch3.json')) {
        return Promise.resolve({
          json: () => Promise.resolve(mockData),
        });
      }
      return Promise.reject(new Error('Invalid URL'));
    });
  });

  afterEach(() => {
    window.fetch.mockRestore();
  });

  test('renders table correctly', async () => {
    render(<BranchData />);

    // Wait for the data to be fetched and rendered
    await screen.findByText('Product A');
    await screen.findByText('$400.00');
    await screen.findByText('Product B');
    await screen.findByText('$800.00');
    await screen.findByText('Product C');
    await screen.findByText('$1,200.00');
  });

  test('filters table by product name', async () => {
    render(<BranchData />);

    // Wait for the data to be fetched and rendered
    await screen.findByText('Product A');
    await screen.findByText('Product B');
    await screen.findByText('Product C');

    const searchInput = screen.getByLabelText('Search:');
    userEvent.type(searchInput, 'A');

    // eslint-disable-next-line testing-library/prefer-presence-queries
    expect(screen.queryByText('Product A')).toBeInTheDocument();
    expect(screen.queryByText('Product B')).not.toBeInTheDocument();
    expect(screen.queryByText('Product C')).not.toBeInTheDocument();
  });

  test('calculates total revenue correctly', async () => {
    render(<BranchData />);

    // Wait for the data to be fetched and rendered
    await screen.findByText('$600.00');
  });
});
