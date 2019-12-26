import { traffic } from '../sim4me';
import { request } from '../request';

const phone = '08012345678';

test('throw no script error', async () => {
  jest
    .spyOn(request, 'postTraffic')
    .mockReturnValue(Promise.resolve('<body><script></script></body>'));
  await expect(traffic({ phone }, request)).rejects.toThrow('No Script Code.');
});

test('throw FunctioneExpression error', async () => {
  jest
    .spyOn(request, 'postTraffic')
    .mockReturnValue(
      Promise.resolve(`<body><script>console.log('ok')</script></body>`)
    );
  await expect(traffic({ phone }, request)).rejects.toThrow(
    'Not FunctionExpression.'
  );
});

test('throw VariableDeclaration error', async () => {
  jest.spyOn(request, 'postTraffic').mockReturnValue(
    Promise.resolve(
      `<body><script>
    window.addEventListener('load', function() {
    });
    </script></body>`
    )
  );
  await expect(traffic({ phone }, request)).rejects.toThrow(
    'Not VariableDeclaration.'
  );
});

test('throw ObjectExpression error', async () => {
  jest.spyOn(request, 'postTraffic').mockReturnValue(
    Promise.resolve(
      `<body><script>
  window.addEventListener('load', function() {
    var chart = new Chart(document.getElementById('packet-chart'));
  });
  </script></body>`
    )
  );
  await expect(traffic({ phone }, request)).rejects.toThrow(
    'Not ObjectExpression.'
  );
});

test('throw notfound error', async () => {
  jest.spyOn(request, 'postTraffic').mockReturnValue(
    Promise.resolve(
      `<body><script>
    window.addEventListener('load', function() {
      var chart = new Chart(document.getElementById('packet-chart'), {});
    });
    </script></body>`
    )
  );
  await expect(traffic({ phone }, request)).rejects.toThrow('Not Found data.');
});

test('success', async () => {
  const spy = jest.spyOn(request, 'postTraffic').mockReturnValue(
    Promise.resolve(
      `<body><script>
    window.addEventListener('load', function() {
      var chart = new Chart(document.getElementById('packet-chart'), {
        type: 'line',
        data: JSON.parse('{"labels":[1,2,3],"datasets":[{"data":[null,0,0]}]}')
      });
    });
    </script></body>`
    )
  );
  const response = await traffic({ phone }, request);
  expect(spy).toHaveBeenCalled();
  expect(response).toHaveProperty('total');
  expect(response).toHaveProperty('traffic');
  expect(response).toHaveProperty('labels');
});
