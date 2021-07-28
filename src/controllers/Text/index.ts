import yaspeller from 'yaspeller';
import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

import https from 'https';
import { IDecoratedRequest } from '../../../types/common/App';
import * as T from '../../../types/Auth/Controllers';
import app from '../../../app';
import { boom } from '../../../types/common/errors';

export const controllers = {
  textCorrect: async (request: any, h: any): Promise<any | boom> => {
    try {
      const {
        payload: { text },
      } = request;
      console.log('!!!!!!!!!!!', text);
      const filePath = path.join(__dirname, '../../../data_base/dump/text.txt');

      const url = `https://speller.yandex.net/services/spellservice.json/checkText?text=`;

      const fullUrl = url + text.split(' ').join('+');
      // console.log(url + text.split(' ').join('+'));
      let newText = '';
      const func = async () => {
        const response = await fetch(fullUrl)
          .then((res) => res.json())
          .then((res) =>
            res.forEach((item) => {
              // console.log(item.s[0]);
              newText += ` ${item.s[0]}`;
              // console.log('55555555555555555', newText);
            })
          );
        // console.log('55555555555555555', newText);

        return newText;
      };
      const response = func();

      return response;
    } catch (e) {
      app.log.error(e);
      return app.generateHttpError(e);
    }
  },
};
