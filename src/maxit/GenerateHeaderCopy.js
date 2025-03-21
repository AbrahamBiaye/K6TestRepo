
import http, { get } from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from 'k6/data';

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
const duid = new SharedArray('user duid', function () {
  return JSON.parse(open('../../ressource/data/maxit/config.json')).duids;
});
const pin = new SharedArray('user pin', function () {
  return JSON.parse(open('../../ressource/data/maxit/config.json')).pins;
});


export let options = {
  vus: 1, 
  duration: "5s", 
};


export default function() {
  let url = `${getHeaderUrl[0].preProdHeader}/common/generate-header?msisdn=${msisdn[0].msisdn1}&pin=${pin[0].pin1}&deviceId=${duid[0].duid1}`;

  let headers = {
    Authorization: `Bearer ${token[0].tokenConnexion}`,
    __app_key__: appKey,
    ...headersData
  }

  let res = http.get(`${getHeaderUrl[0].getHeader}/v1/mob/forfait/check-forfait/${msisdn}`, { headers });
  check(res, {
    "Réponse GetHeader HTTP est 200": (r) => r.status === 200,
  });

  // let responseJson = JSON.parse(res.body);
  // let token = responseJson.token;

  // console.log(`TOKEN RECUPERER: ${token}`);


  sleep(1); // Pause d'une seconde entre les itérations
}
