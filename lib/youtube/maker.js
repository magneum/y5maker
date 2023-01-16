import got from "got";
function _throw(url, v_id, ftype, fquality, token, timeExpire, fname) {
  return new Promise(async (resolve, reject) => {
    var _started = await got(url, {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        origin: "https://yt5s.com",
        referer: "https://yt5s.com/",
        "user-agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
        "X-Requested-Key": "de0cfuirtgf67a",
      },
      form: {
        v_id,
        ftype,
        fquality,
        token,
        timeExpire,
        client: "yt5s.com",
      },
    }).json();
    var server = _started.c_server;
    if (!server && ftype === "mp3")
      return resolve(server || _started.d_url || "");
    var _results = await got(`${server}/api/json/convert`, {
      method: "POST",
      form: {
        v_id,
        ftype,
        fquality,
        fname,
        token,
        timeExpire,
      },
    }).json();
    if (_results.statusCode === 200) {
      return resolve(_results.result);
    } else if (_results.statusCode === 300) {
      try {
        var WebSocket = (await import("ws")).default;
        var Url = new URL(server);

        var ws = new WebSocket(
          `${/https/i.test(Url.protocol) ? "wss:" : "ws:"}//${Url.host}/sub/${
            _results.jobId
          }?fname=yt5s.com`,
          undefined,
          {
            headers: {
              "Accept-Encoding": "gzip, deflate, br",
              Host: Url.host,
              Origin: "https://yt5s.com",
              "Sec-WebSocket-Extensions":
                "permessage-deflate; client_max_window_bits",
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
            },
          }
        );
        ws.on("message", function incoming(message) {
          var msg = JSON.parse(message.toString());
          if (msg.action === "success") {
            try {
              ws.close();
            } catch (e) {
              console.error(e);
            }
            ws.removeAllListeners("message");
            return resolve(msg.url);
          } else if (msg.action === "error") return reject(msg);
        });
      } catch (e) {
        console.error(e);
        return reject(e);
      }
    } else return reject(_results);
  });
}
// ================================================================================ //
export async function YouTube(url) {
  var html = await got("https://yt5s.com/en32").text();
  var urlConvert = (/k_url_convert="(.*?)"/.exec(html) || ["", ""])[1];
  var json = await got((/k_url_search="(.*?)"/.exec(html) || ["", ""])[1], {
    method: "POST",
    headers: {
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      cookie:
        "__cflb=04dToSoFRg9oqH9pYF2En9gKJK4fe8D9TcYtUD6tYu; _ga=GA1.2.1350132744.1641709803; _gid=GA1.2.1492233267.1641709803; _gat_gtag_UA_122831834_4=1",
      origin: "https://yt5s.com",
      "user-agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36",
    },
    searchParams: new URLSearchParams(
      Object.entries({
        q: url,
        vt: "home",
      })
    ),
  }).json();
  // ================================================================================ //
  var video = {};
  Object.values(json.links.mp4).forEach(({ k, size }) => {
    video[k] = {
      quality: k,
      pSize: size,
      download: _throw.bind(
        null,
        urlConvert,
        json.vid,
        "mp4",
        k,
        json.token,
        parseInt(json.timeExpires),
        json.fn
      ),
    };
  });
  // ================================================================================ //
  var audio = {};
  Object.values(json.links.mp3).forEach(({ key, size }) => {
    audio[key] = {
      quality: key,
      pSize: size,
      download: _throw.bind(
        null,
        urlConvert,
        json.vid,
        "mp3",
        key.replace(/kbps/i, ""),
        json.token,
        parseInt(json.timeExpires),
        json.fn
      ),
    };
  });
  // ================================================================================ //
  return {
    id: json.vid,
    title: json.title,
    thumbnail: `https://i.ytimg.com/vi/${json.vid}/0.jpg`,
    video,
    audio,
  };
}
