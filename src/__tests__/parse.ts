import { getScriptCode } from '../parse';

const script = `console.log('script code')`;

test('getScriptCode', () => {
  expect(
    getScriptCode(`
<!DOCTYPE html>
<html lang="en">
<body></body>
</html>
  `)
  ).toBe('');

  expect(
    getScriptCode(`
  <!DOCTYPE html>
<html lang="en">
<body><script>${script}</script></body>
</html>
  `)
  ).toBe(script);

  expect(
    getScriptCode(`
  <!DOCTYPE html>
<html lang="en">
<body><script>${script + script}</script><script>${script}</script></body>
</html>
  `)
  ).toBe(script + script);
});
