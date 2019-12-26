import { request } from '../request';

jest.mock('request', () => ({
  defaults: () => jest.fn(),
}));

jest.mock('util', () => ({
  promisify: () => () => 'ok!',
}));

test('request', async () => {
  const res = await request.postTraffic({ phone: '09012345678' });
  expect(res).toBe('ok!');
});

test('ym', () => {
  const ym = request['ym']();
  expect(typeof ym === 'string').toBe(true);
  expect(ym.split('-').length).toBe(2);
});
