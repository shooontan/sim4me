import cheerio from 'cheerio';

export const getScriptCode = (source: string) => {
  const $ = cheerio.load(source);
  const code = $('body script')
    .first()
    .html();
  return code || '';
};
