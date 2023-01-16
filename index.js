import { shorten } from "tinyurl";
import { YouTube } from "./maker.js";

export async function userInput(quality, url) {
  return new Promise(async (resolve, reject) => {
    if (quality == "1080p") {
      YouTube(url)
        .catch((_) => YouTube(url))
        .then(async (_maker) => {
          return resolve({
            type: "[ VIDEO ]",
            id: _maker.id,
            title: _maker.title,
            size: _maker.video["1080p"].pSize,
            quick_dl: await shorten(await _maker.video["1080p"].download()),
          });
        });
    } else if (quality == "720p") {
      YouTube(url)
        .catch((_) => YouTube(url))
        .then(async (_maker) => {
          return resolve({
            type: "[ VIDEO ]",
            id: _maker.id,
            title: _maker.title,
            size: _maker.video["720p"].pSize,
            quick_dl: await shorten(await _maker.video["720p"].download()),
          });
        });
    } else if (quality == "480p") {
      YouTube(url)
        .catch((_) => YouTube(url))
        .then(async (_maker) => {
          return resolve({
            type: "[ VIDEO ]",
            id: _maker.id,
            title: _maker.title,
            size: _maker.video["480p"].pSize,
            quick_dl: await shorten(await _maker.video["480p"].download()),
          });
        });
    } else if (quality == "360p") {
      YouTube(url)
        .catch((_) => YouTube(url))
        .then(async (_maker) => {
          return resolve({
            type: "[ VIDEO ]",
            id: _maker.id,
            title: _maker.title,
            size: _maker.video["360p"].pSize,
            quick_dl: await shorten(await _maker.video["360p"].download()),
          });
        });
    } else if (quality == "240p") {
      YouTube(url)
        .catch((_) => YouTube(url))
        .then(async (_maker) => {
          return resolve({
            type: "[ VIDEO ]",
            id: _maker.id,
            title: _maker.title,
            size: _maker.video["240p"].pSize,
            quick_dl: await shorten(await _maker.video["240p"].download()),
          });
        });
    } else if (quality == "144p") {
      YouTube(url)
        .catch((_) => YouTube(url))
        .then(async (_maker) => {
          return resolve({
            type: "[ VIDEO ]",
            id: _maker.id,
            title: _maker.title,
            size: _maker.video["144p"].pSize,
            quick_dl: await shorten(await _maker.video["144p"].download()),
          });
        });
    } else if (quality == "128kbps") {
      YouTube(url)
        .catch((_) => YouTube(url))
        .then(async (_maker) => {
          return resolve({
            type: "[ AUDIO ]",
            id: _maker.id,
            title: _maker.title,
            size: _maker.audio["128kbps"].pSize,
            quick_dl: await shorten(await _maker.audio["128kbps"].download()),
          });
        });
    } else {
      return resolve({
        _message: "[ERROR] Wrong Quality Argument!",
        _qualities: {
          videos: "1080p, 720p, 480p, 360p, 240p, 144p",
          audio: "128kbps",
        },
      });
    }
  });
}

userInput("720p", "https://youtu.be/iik25wqIuFo").then((_Found) => {
  console.log(_Found);
});
