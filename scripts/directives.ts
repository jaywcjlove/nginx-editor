import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { Element } from 'domhandler';
import fs from 'fs';
import path from 'path';
import TurndownService from 'turndown';

type ResultDataItem = Omit<DataItem, 'd'> & { d: string; };
type DataItem = {
  /** directive name */
  n: string;
  /** module name */
  m: string;
  /** directive detail */
  d: string[];
  /** default value */
  v?: string;
  /** context */
  c?: string;
  /** syntax */
  s?: string;
}

const turndownService = new TurndownService({
  // codeBlockStyle: 'fenced'
});

async function request(url: string): Promise<string | undefined> {
  try {
    const data = await fetch(url).then(res => res.buffer());
    return data.toString();
  } catch(error) {
    console.log('ERR:REQUEST:', error);
    process.exitCode = 1;
  }
}

function nextSibling(child: Element, opt: { tagName: string; class?: string; }) {
  let nextNode = child;
  let result = undefined
  do {
    nextNode = nextNode.nextSibling as Element;
    if (
      nextNode && nextNode.name
      && (opt.tagName ? nextNode.tagName === opt.tagName : false)
      && (opt.class ? nextNode.attribs.class === opt.class : true)
    ) {
      result = nextNode;
    }
  } while (!!nextNode);
  return result;
}

async function getData(url: string) {
  console.log(`\x1b[1;35m Request URL:\x1b[0m =>\x1b[34m ${url} \x1b[0m`);
  try {
    const data = await request(url);
    if (data) {
      const $ = cheerio.load(data);
      const childs = $('#content').children();
      const module = childs.first().text().replace(/^Module /g, '');
      const result: DataItem[] = [];
      let resultItem: DataItem = {
        m: module,
        n: '',
        d: [],
      }
      let variablesElm: Element = undefined;
      childs.map((idx, child) => {
        if (child.attribs.name && child.tagName === 'a') {
          result.push({ ...resultItem });
          resultItem.n = child.attribs.name;
          resultItem.d = [];
          if (child.attribs.name === 'variables') {
            variablesElm = nextSibling(child, { tagName: 'dl', class: 'compact' });
          }
        }
        if (child.attribs.class === 'directive') {
          const tr = $(child).find('table tr');
          resultItem.s = turndownService.turndown($('td', tr[0]).html());
          resultItem.v = turndownService.turndown($('td', tr[1]).html());
          resultItem.c = turndownService.turndown($('td', tr[2]).html());
        }
        const text = $(child).html();
        if (text && text !== '') {
          if (/directive/.test(child.attribs.class)) return;
          if (child.attribs.class === 'example') {
            resultItem.d.push(`\`\`\`\n${$(child).text() || ''}\n\`\`\``);
          } else {
            resultItem.d.push(turndownService.turndown(text || ''));
          }
        }
        if (idx + 1 === childs.length) {
          result.push({ ...resultItem });
        }
      });
      $(variablesElm).children().map((idx, child) => {
        if (child.tagName === 'dt' && child.attribs.id) {
          result.push({
            m: module,
            n: $(child).text(),
            d: [turndownService.turndown($(nextSibling(child, { tagName: 'dd' })).html())]
          });
        }
      });
      const directivesData: ResultDataItem[] = result.map(item => {
        const data: ResultDataItem = { m: item.m, n: item.n, d: item.d.join('\n') };
        if (item.v && item.v.replace(/^—+/g, '')) {
          data.v = item.v.replace(/^—+/g, '');
        }
        if (item.c) {
          data.c = item.c;
        }
        if (item.s && item.s.replace(/(^`+)|(`+$)/g, '')) {
          data.s = item.s.replace(/(^`+)|(`+$)/g, '');
        }
        data.d = data.d.replace(/\[(.[^\]]+)\]\((.[^)]+)\)/g, (str, $1, $2) => {
          if (/^#/.test($2)) {
            return `[${$1}](${url}${$2})`;
          }
          if (/^\./.test($2)) {
            return `[${$1}](https:/${path.resolve(path.dirname(url.replace(/^https:\//, '')), $2)})`;
          }
          return str;
        });
        return { ...data  }
      }).filter(m => m.n && !/^(directives|example|summary)/.test(m.n));
      console.log(`\x1b[35m  ->\x1b[0m Data Length:\x1b[32m ${directivesData.length} \x1b[0m`);
      console.log(`\x1b[35m  ->\x1b[0m Find Variables Node:\x1b[36m ${variablesElm ? $(variablesElm).length : 0} \x1b[0m`);
      return directivesData;
    }
    return [];
  } catch (error) {
    console.log('ERR:GETDATA:', error);
    process.exit()
  }
}

;(async () => {
  let resultData: ResultDataItem[] = [];

  const core = await getData('https://nginx.org/en/docs/ngx_core_module.html');

  const http_core = await getData('https://nginx.org/en/docs/http/ngx_http_core_module.html');
  const http_access = await getData('https://nginx.org/en/docs/http/ngx_http_access_module.html');
  const http_addition = await getData('https://nginx.org/en/docs/http/ngx_http_addition_module.html');
  const http_api = await getData('https://nginx.org/en/docs/http/ngx_http_api_module.html');
  const http_auth_basic = await getData('https://nginx.org/en/docs/http/ngx_http_auth_basic_module.html');
  const http_auth_jwt = await getData('https://nginx.org/en/docs/http/ngx_http_auth_jwt_module.html');
  const http_auth_request = await getData('https://nginx.org/en/docs/http/ngx_http_auth_request_module.html');
  const http_autoindex = await getData('https://nginx.org/en/docs/http/ngx_http_autoindex_module.html');
  const http_browser = await getData('https://nginx.org/en/docs/http/ngx_http_browser_module.html');
  const http_charset = await getData('https://nginx.org/en/docs/http/ngx_http_charset_module.html');
  const http_dav = await getData('https://nginx.org/en/docs/http/ngx_http_dav_module.html');
  const http_empty_gif = await getData('https://nginx.org/en/docs/http/ngx_http_empty_gif_module.html');
  const http_f4f = await getData('https://nginx.org/en/docs/http/ngx_http_f4f_module.html');
  const http_fastcgi = await getData('https://nginx.org/en/docs/http/ngx_http_fastcgi_module.html');
  const http_flv = await getData('https://nginx.org/en/docs/http/ngx_http_flv_module.html');
  const http_geo = await getData('https://nginx.org/en/docs/http/ngx_http_geo_module.html');
  const http_geoip = await getData('https://nginx.org/en/docs/http/ngx_http_geoip_module.html');
  const http_grpc = await getData('https://nginx.org/en/docs/http/ngx_http_grpc_module.html');
  const http_gunzip = await getData('https://nginx.org/en/docs/http/ngx_http_gunzip_module.html');
  const http_gzip = await getData('https://nginx.org/en/docs/http/ngx_http_gzip_module.html');
  const http_gzip_static = await getData('https://nginx.org/en/docs/http/ngx_http_gzip_static_module.html');
  const http_headers = await getData('https://nginx.org/en/docs/http/ngx_http_headers_module.html');
  const http_hls = await getData('https://nginx.org/en/docs/http/ngx_http_hls_module.html');
  const http_image_filter = await getData('https://nginx.org/en/docs/http/ngx_http_image_filter_module.html');
  const http_index = await getData('https://nginx.org/en/docs/http/ngx_http_index_module.html');
  const http_js = await getData('https://nginx.org/en/docs/http/ngx_http_js_module.html');
  const http_keyval = await getData('https://nginx.org/en/docs/http/ngx_http_keyval_module.html');
  const http_limit_conn = await getData('https://nginx.org/en/docs/http/ngx_http_limit_conn_module.html');
  const http_limit_req = await getData('https://nginx.org/en/docs/http/ngx_http_limit_req_module.html');
  const http_log = await getData('https://nginx.org/en/docs/http/ngx_http_log_module.html');
  const http_map = await getData('https://nginx.org/en/docs/http/ngx_http_map_module.html');
  const http_memcached = await getData('https://nginx.org/en/docs/http/ngx_http_memcached_module.html');
  const http_mirror = await getData('https://nginx.org/en/docs/http/ngx_http_mirror_module.html');
  const http_mp4 = await getData('https://nginx.org/en/docs/http/ngx_http_mp4_module.html');
  const http_perl = await getData('https://nginx.org/en/docs/http/ngx_http_perl_module.html');
  const http_proxy = await getData('https://nginx.org/en/docs/http/ngx_http_proxy_module.html');
  const http_random_index = await getData('https://nginx.org/en/docs/http/ngx_http_random_index_module.html');
  const http_realip = await getData('https://nginx.org/en/docs/http/ngx_http_realip_module.html');
  const http_referer = await getData('https://nginx.org/en/docs/http/ngx_http_referer_module.html');
  const http_rewrite = await getData('https://nginx.org/en/docs/http/ngx_http_rewrite_module.html');
  const http_scgi = await getData('https://nginx.org/en/docs/http/ngx_http_scgi_module.html');
  const http_secure_link = await getData('https://nginx.org/en/docs/http/ngx_http_secure_link_module.html');
  const http_session_log = await getData('https://nginx.org/en/docs/http/ngx_http_session_log_module.html');
  const http_slice = await getData('https://nginx.org/en/docs/http/ngx_http_slice_module.html');
  const http_spdy = await getData('https://nginx.org/en/docs/http/ngx_http_spdy_module.html');
  const http_split_clients = await getData('https://nginx.org/en/docs/http/ngx_http_split_clients_module.html');
  const http_ssi = await getData('https://nginx.org/en/docs/http/ngx_http_ssi_module.html');
  const http_ssl = await getData('https://nginx.org/en/docs/http/ngx_http_ssl_module.html');
  const http_status = await getData('https://nginx.org/en/docs/http/ngx_http_status_module.html');
  const http_stub_status = await getData('https://nginx.org/en/docs/http/ngx_http_stub_status_module.html');
  const http_sub = await getData('https://nginx.org/en/docs/http/ngx_http_sub_module.html');
  const http_upstream = await getData('https://nginx.org/en/docs/http/ngx_http_upstream_module.html');
  const http_upstream_conf = await getData('https://nginx.org/en/docs/http/ngx_http_upstream_conf_module.html');
  const http_upstream_hc = await getData('https://nginx.org/en/docs/http/ngx_http_upstream_hc_module.html');
  const http_userid = await getData('https://nginx.org/en/docs/http/ngx_http_userid_module.html');
  const http_uwsgi = await getData('https://nginx.org/en/docs/http/ngx_http_uwsgi_module.html');
  const http_v2 = await getData('https://nginx.org/en/docs/http/ngx_http_v2_module.html');
  const http_xslt = await getData('https://nginx.org/en/docs/http/ngx_http_xslt_module.html');

  const mail_core = await getData('https://nginx.org/en/docs/mail/ngx_mail_core_module.html');
  const mail_auth_http = await getData('https://nginx.org/en/docs/mail/ngx_mail_auth_http_module.html');
  const mail_proxy = await getData('https://nginx.org/en/docs/mail/ngx_mail_proxy_module.html');
  const mail_ssl = await getData('https://nginx.org/en/docs/mail/ngx_mail_ssl_module.html');
  const mail_imap = await getData('https://nginx.org/en/docs/mail/ngx_mail_imap_module.html');
  const mail_pop3 = await getData('https://nginx.org/en/docs/mail/ngx_mail_pop3_module.html');
  const mail_smtp = await getData('https://nginx.org/en/docs/mail/ngx_mail_smtp_module.html');

  const stream_core = await getData('https://nginx.org/en/docs/stream/ngx_stream_core_module.html');
  const stream_access = await getData('https://nginx.org/en/docs/stream/ngx_stream_access_module.html');
  const stream_geo = await getData('https://nginx.org/en/docs/stream/ngx_stream_geo_module.html');
  const stream_geoip = await getData('https://nginx.org/en/docs/stream/ngx_stream_geoip_module.html');
  const stream_js = await getData('https://nginx.org/en/docs/stream/ngx_stream_js_module.html');
  const stream_keyval = await getData('https://nginx.org/en/docs/stream/ngx_stream_keyval_module.html');
  const stream_limit_conn = await getData('https://nginx.org/en/docs/stream/ngx_stream_limit_conn_module.html');
  const stream_log = await getData('https://nginx.org/en/docs/stream/ngx_stream_log_module.html');
  const stream_map = await getData('https://nginx.org/en/docs/stream/ngx_stream_map_module.html');
  const stream_proxy = await getData('https://nginx.org/en/docs/stream/ngx_stream_proxy_module.html');
  const stream_realip = await getData('https://nginx.org/en/docs/stream/ngx_stream_realip_module.html');
  const stream_return = await getData('https://nginx.org/en/docs/stream/ngx_stream_return_module.html');
  const stream_set = await getData('https://nginx.org/en/docs/stream/ngx_stream_set_module.html');
  const stream_split_clients = await getData('https://nginx.org/en/docs/stream/ngx_stream_split_clients_module.html');
  const stream_ssl = await getData('https://nginx.org/en/docs/stream/ngx_stream_ssl_module.html');
  const stream_ssl_preread = await getData('https://nginx.org/en/docs/stream/ngx_stream_ssl_preread_module.html');
  const stream_upstream = await getData('https://nginx.org/en/docs/stream/ngx_stream_upstream_module.html');
  const stream_upstream_hc = await getData('https://nginx.org/en/docs/stream/ngx_stream_upstream_hc_module.html');
  const stream_zone_sync = await getData('https://nginx.org/en/docs/stream/ngx_stream_zone_sync_module.html');

  const google_perftools = await getData('https://nginx.org/en/docs/ngx_google_perftools_module.html');

  resultData = resultData.concat(core, http_core, http_access, http_addition, http_api, http_auth_basic, http_auth_jwt, http_auth_request, http_autoindex, http_browser, http_charset, http_dav, http_empty_gif, http_f4f, http_fastcgi, http_flv, http_geo, http_geoip, http_grpc, http_gunzip, http_gzip, http_gzip_static, http_headers, http_hls, http_image_filter, http_index, http_js, http_keyval, http_limit_conn, http_limit_req, http_log, http_map, http_memcached, http_mirror, http_mp4, http_perl, http_proxy, http_random_index, http_realip, http_referer, http_rewrite, http_scgi, http_secure_link, http_session_log, http_slice, http_spdy, http_split_clients, http_ssi, http_ssl, http_status, http_stub_status, http_sub, http_upstream, http_upstream_conf, http_upstream_hc, http_userid, http_uwsgi, http_v2, http_xslt, mail_core, mail_auth_http, mail_proxy, mail_ssl, mail_imap, mail_pop3, mail_smtp, stream_core, stream_access, stream_geo, stream_geoip, stream_js, stream_keyval, stream_limit_conn, stream_log, stream_map, stream_proxy, stream_realip, stream_return, stream_set, stream_split_clients, stream_ssl, stream_ssl_preread, stream_upstream, stream_upstream_hc, stream_zone_sync, google_perftools)
  await fs.promises.writeFile(path.resolve(process.cwd(), 'src/directives.json'), JSON.stringify(resultData, null, 2));
  console.log(`\x1b[1;35m Done:\x1b[0m\x1b[32m ${path.resolve(process.cwd(), 'src/directives.json')} \x1b[0m`);
  console.log(`\x1b[1;35m  -> DataSource Length:\x1b[0m\x1b[32m ${resultData.length} \x1b[0m`);
})();