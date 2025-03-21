import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from 'k6/data';

export let options = {
  vus: 1,
  duration: "5s",
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
const msisdn = new SharedArray('user number', function () {
  return JSON.parse(open('../../ressource/data/maxit/config.json')).msisdns;
});

export default function() {
  let url = `${getHeaderUrl[0].getHeader1}/v1/mob/forfait/list-subscriptions/${msisdn[0].msisdn1}?sort=start_date_time,desc`;

  let headers = {
    Authorization: `Bearer ${token}`,
    __app_key__: appKey,
    ...headersData
  }

  let res = http.get(url, { headers: headers });

  check(res, {
    "Statut 200 reçu": (r) => r.status === 200,
  });

  sleep(1);
}
