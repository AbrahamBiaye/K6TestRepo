import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from 'k6/data';

export let options = {
  vus: 1, // Nombre d'utilisateurs simultanés
  duration: "5s", // Durée du test
};

const token = new SharedArray('user token', function () {
  return JSON.parse(open('../../ressource/data/maxit/ressources.json')).tokens;
});
const appKey = new SharedArray('user appKey', function () {
  return JSON.parse(open('../../ressource/data/maxit/ressources.json')).appKeys;
});
const headersData = new SharedArray('user head data', function () {
  return JSON.parse(open('../../ressource/data/maxit/header.json')).headers;
});
const getHeaderUrl = new SharedArray('get Header url', function () {
  return JSON.parse(open('../../ressource/data/maxit/config.json')).urls;
});


export default function() {
  let url = `${getHeaderUrl[0].getHeader}/v1/mob/forfait/get-bundle/FULL`;

  let headers = {
    Authorization: `Bearer ${token}`,
    __app_key__: appKey,
    ...headersData
  }

  let res = http.get(url, {
    headers: headers,
  });

  check(res, {
    "status is 200": (r) => r.status === 200,
    "response is not empty": (r) => r.body.length > 0,
  });

  sleep(1);
}
