import FormData from 'form-data';
import nock from 'nock';
import { request } from '../request';

test('ym', () => {
  const ym = request['ym']();
  expect(typeof ym === 'string').toBe(true);
  expect(ym.split('-').length).toBe(2);
});

test('buildForm', () => {
  const form = request['buildForm']('090');
  expect(form).toBeInstanceOf(FormData);
});

test('request', async () => {
  nock('https://example.com/traffic')
    .post('/index')
    .reply(302, '', {
      'set-cookie': 'KEY=VALUE; path=/mobile/; secure; HttpOnly',
      location: ['https://example.com/traffic/show'],
    });

  nock('https://example.com', {
    reqheaders: {
      cookie: 'KEY=VALUE',
    },
  })
    .get('/traffic/show')
    .reply(200, 'ok!');

  const res = await request.postTraffic(
    { phone: '09012345678' },
    'https://example.com/traffic/index'
  );
  expect(res).toBe('ok!');
});
