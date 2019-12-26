import req from 'request';
import { promisify } from 'util';

const requestInstance = req.defaults({
  jar: true,
});

const requestP = promisify(requestInstance);

export type PostTrafficOpts = {
  phone: string;
  ym?: string; // yyyy-mm
};

export type PostTrafficRes = req.Response & {
  body: string;
};

export class request {
  private static trafficUrl = 'https://sim4.me/mobile/traffic/index';

  private static ym() {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth() + 1}`;
  }

  public static async postTraffic(
    opts: PostTrafficOpts
  ): Promise<PostTrafficRes> {
    return requestP({
      method: 'POST',
      url: this.trafficUrl,
      form: {
        _method: 'POST',
        msn: opts.phone,
        use_ym: opts.ym || this.ym(),
        action: 'show',
      },
      followAllRedirects: true,
    });
  }
}
