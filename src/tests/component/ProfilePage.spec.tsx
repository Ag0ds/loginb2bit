import { render, screen } from '@testing-library/react';
import ProfilePage from '@/app/(protected)/profile/page';
import api from '@/lib/axios';

jest.mock('@/lib/axios', () => ({
  __esModule: true,
  default: {
    get: jest.fn(),
    post: jest.fn(),
    interceptors: { request: { use: jest.fn() }, response: { use: jest.fn() } },
  },
}));

const mockedApi = api as unknown as { get: jest.Mock };

describe('ProfilePage', () => {
  beforeEach(() => mockedApi.get.mockReset());

  it('renderiza dados do profile quando autenticado', async () => {
    mockedApi.get.mockResolvedValueOnce({
      data: {
        id: 'uuid',
        avatar: null,
        name: 'Miguel',
        last_name: 'Rocha',
        email: 'miguel@b2bit.company',
        role: { value: 0, label: 'Staff' },
        staff_role: { value: 0, label: 'Admin' },
        last_login: '2022-03-08T14:28:39.781811Z',
      },
    });

    render(<ProfilePage />);
    expect(await screen.findByText(/Miguel\s+Rocha/i)).toBeInTheDocument();
    expect(screen.getByText(/miguel@b2bit.company/i)).toBeInTheDocument();
    const has = (re: RegExp) => (_: string, node?: Element | null) => {
      if (!node) return false;
      const txt = (node.textContent ?? '').replace(/\s+/g, ' ').trim();
      return re.test(txt);
    };
    const getByJoinedText = (re: RegExp) =>
      screen.getByText((_, node) => {
        if (!node) return false;
        const matchesSelf = has(re)(_, node);
        const children = Array.from(node.children ?? []);
        const noneChildMatches = children.every((c) => !has(re)(_, c));
        return matchesSelf && noneChildMatches;
      });
    expect(getByJoinedText(/Your\s*Name/i)).toBeInTheDocument();
    expect(getByJoinedText(/Your\s*E-?mail/i)).toBeInTheDocument();
  });
});
