import Jimp from 'jimp';
import { User } from 'discord.js';
import { ASSET_BASE_PATH } from './Constants';

export const roundNumber = (num: number, scale = 0) => {
  if (!num.toString().includes('e')) {
    return Number(`${Math.round(Number(`${num}e+${scale}`))}e-${scale}`);
  }
  const arr = `${num}`.split('e');
  let sig = '';

  if (Number(arr[1]) + scale > 0) {
    sig = '+';
  }

  return Number(`${Math.round(Number(`${Number(arr[0])}e${sig}${Number(arr[1]) + scale}`))}e-${scale}`);
};

export async function maskImage(image: string, resize?: number) {
  const p1 = await Jimp.read(image);
  const p2 = await Jimp.read('src/assets/mask.png');
  if (resize) p1.resize(resize, Jimp.AUTO);
  if (resize) p2.resize(resize, Jimp.AUTO);
  return p1.mask(p2, 0, 0);
}

export async function ship2(user1: User, user2: User) {
  // canvas
  const canvas = await Jimp.read(384, 128);
  // heart
  const heart = await Jimp.read(`${ASSET_BASE_PATH}/ribbon/heart.png`);
  // avatars
  const avatar1 = await maskImage(user1.displayAvatarURL, 128);
  const avatar2 = await maskImage(user2.displayAvatarURL, 128);

  canvas.blit(avatar1, 0, 0);
  canvas.blit(avatar2, 256, 0);
  canvas.blit(heart, 160, 32);

  // shipname
  const randLengthRomeo = roundNumber(Math.random() * 4 + 2);
  const randLengthJuliet = roundNumber(Math.random() * 4 + 2);
  const shipName = (
    user1.username.substring(0, roundNumber(user1.username.length / randLengthRomeo)) +
    user2.username.substring(roundNumber(user2.username.length / randLengthJuliet))
  ).replace(/[.,\\/#!$%^&*;:{}=\-_`~() ]/g, '');

  const buffer = await canvas.getBufferAsync(Jimp.MIME_PNG);
  return { buffer, shipName };
}

export function getImageCenter(width: number, height: number) {
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
}

export async function welcome(user: User) {
  const background = await Jimp.read('src/assets/welcome.png');
  const avatar = await maskImage(user.displayAvatarURL, 200);

  // const coords = getImageCenter(avatar.getWidth(), avatar.getHeight());
  background.blit(avatar, 410, 170);

  const buffer = await background.getBufferAsync(Jimp.MIME_PNG);
  return buffer;
}
