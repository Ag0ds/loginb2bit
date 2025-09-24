import '@testing-library/jest-dom';
import 'whatwg-fetch';

jest.mock('next/navigation', () => {
  const push = jest.fn();
  const replace = jest.fn();
  const back = jest.fn();
  return { useRouter: () => ({ push, replace, back }) };
});
