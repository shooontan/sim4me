import fetch from 'node-fetch';
import FormData from 'form-data';

export type PostTrafficOpts = {
  phone: string;
  ym?: string; // yyyy-mm
};

const parseCookies = (cookies: string[]) =>
  cookies
    .map(cookie => {
      const parts = cookie.split(';');
      const cookiePart = parts[0];
      return cookiePart;
    })
    .join(';');

export class request {
  private static trafficUrl = 'https://sim4.me/mobile/traffic/index';

  private static ym() {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}`;
  }

  private static buildForm(phone: string, ym?: string) {
    const form = new FormData();
    form.append('_method', 'POST');
    form.append('msn', phone);
    form.append('use_ym', ym || this.ym());
    form.append('action', 'show');
    return form;
  }

  public static async postTraffic(
    opts: PostTrafficOpts,
    url = this.trafficUrl
  ) {
    const form = this.buildForm(opts.phone, opts.ym);

    const response = await fetch(url, {
      method: 'POST',
      body: form,
      headers: form.getHeaders(),
      redirect: 'manual',
    });

    // get cookie and redirect location
    const cookie = parseCookies(response.headers.raw()['set-cookie']);
    const location = response.headers.raw()['location']?.[0];
    if (!cookie || !location) {
      return Promise.reject(new Error('Cannot authenticate.'));
    }

    // request with cookie
    return fetch(location, {
      headers: {
        cookie,
      },
    }).then(res => res.text());
  }
}
