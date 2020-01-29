"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }var _jimp = require('jimp'); var _jimp2 = _interopRequireDefault(_jimp);

var _Constants = require('./Constants');

 const roundNumber = (num, scale = 0) => {
  if (!num.toString().includes('e')) {
    return Number(`${Math.round(Number(`${num}e+${scale}`))}e-${scale}`);
  }
  const arr = `${num}`.split('e');
  let sig = '';

  if (Number(arr[1]) + scale > 0) {
    sig = '+';
  }

  return Number(`${Math.round(Number(`${Number(arr[0])}e${sig}${Number(arr[1]) + scale}`))}e-${scale}`);
}; exports.roundNumber = roundNumber;

 async function maskImage(image, resize) {
  const p1 = await _jimp2.default.read(image);
  const p2 = await _jimp2.default.read('src/assets/mask.png');
  if (resize) p1.resize(resize, _jimp2.default.AUTO);
  if (resize) p2.resize(resize, _jimp2.default.AUTO);
  return p1.mask(p2, 0, 0);
} exports.maskImage = maskImage;

 async function ship2(user1, user2) {
  // canvas
  const canvas = await _jimp2.default.read(384, 128);
  // heart
  const heart = await _jimp2.default.read(`${_Constants.ASSET_BASE_PATH}/ribbon/heart.png`);
  // avatars
  const avatar1 = await maskImage(user1.displayAvatarURL, 128);
  const avatar2 = await maskImage(user2.displayAvatarURL, 128);

  canvas.blit(avatar1, 0, 0);
  canvas.blit(avatar2, 256, 0);
  canvas.blit(heart, 160, 32);

  // shipname
  const randLengthRomeo = exports.roundNumber.call(void 0, Math.random() * 4 + 2);
  const randLengthJuliet = exports.roundNumber.call(void 0, Math.random() * 4 + 2);
  const shipName = (
    user1.username.substring(0, exports.roundNumber.call(void 0, user1.username.length / randLengthRomeo)) +
    user2.username.substring(exports.roundNumber.call(void 0, user2.username.length / randLengthJuliet))
  ).replace(/[.,\\/#!$%^&*;:{}=\-_`~() ]/g, '');

  const buffer = await canvas.getBufferAsync(_jimp2.default.MIME_PNG);
  return { buffer, shipName };
} exports.ship2 = ship2;

 function getImageCenter(width, height) {
  const wrh = width / height;
  let newWidth = width;
  let newHeight = newWidth / wrh;
  if (newHeight > height) {
    newHeight = height;
    newWidth = newHeight * wrh;
  }
  const x = newWidth < width ? (width - newWidth) / 2 : 0;
  const y = newHeight < height ? (height - newHeight) / 2 : 0;

  return { y, x };
} exports.getImageCenter = getImageCenter;

 async function welcome(user) {
  const background = await _jimp2.default.read('src/assets/welcome.png');
  const avatar = await maskImage(user.displayAvatarURL, 200);

  // const coords = getImageCenter(avatar.getWidth(), avatar.getHeight());
  background.blit(avatar, 410, 170);

  const buffer = await background.getBufferAsync(_jimp2.default.MIME_PNG);
  return buffer;
} exports.welcome = welcome;
