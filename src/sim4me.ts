import { parse } from '@babel/parser';
import { request, PostTrafficOpts } from './request';
import { getScriptCode } from './parse';

type TrafficOpts = PostTrafficOpts;

export type TrafficRes = {
  total: number;
  traffic: (null | number)[];
  labels: number[];
};

export const throwE = (type: string) => {
  throw new Error(`Not ${type}.`);
};

export const traffic = async (
  opts: TrafficOpts,
  client: typeof request = request
): Promise<TrafficRes> => {
  const response = await client.postTraffic(opts);

  if (typeof response !== 'string' || !response) {
    throw new Error('No Response.');
  }

  const code = getScriptCode(response);
  if (!code) {
    throw new Error('No Script Code.');
  }

  // parse script code
  const ast = parse(code);
  const body = ast.program.body[0];

  if (body?.type !== 'ExpressionStatement') {
    return throwE('ExpressionStatement');
  }

  if (body?.expression?.type !== 'CallExpression') {
    return throwE('CallExpression');
  }

  const func = body?.expression?.arguments[1];
  if (func?.type !== 'FunctionExpression') {
    return throwE('FunctionExpression');
  }

  const chartVar = func?.body?.body[0];
  if (chartVar?.type !== 'VariableDeclaration') {
    return throwE('VariableDeclaration');
  }

  const newChart = chartVar.declarations[0];
  if (!newChart?.init || newChart.init.type !== 'NewExpression') {
    return throwE('NewExpression');
  }

  const optObj = newChart.init.arguments[1];
  if (optObj?.type !== 'ObjectExpression') {
    return throwE('ObjectExpression');
  }

  const property = optObj.properties[1];

  if (
    property &&
    property.type === 'ObjectProperty' &&
    property.value.type === 'CallExpression'
  ) {
    const dataStr = property.value.arguments[0];
    if (dataStr.type === 'StringLiteral') {
      const data = JSON.parse(dataStr.value);
      const traffic = (data?.datasets?.[0]?.data ||
        []) as TrafficRes['traffic'];

      return {
        total: traffic[traffic.length - 1] || 0,
        traffic,
        labels: (data.labels || []) as TrafficRes['labels'],
      };
    }
  }

  throw new Error('Not Found data.');
};
