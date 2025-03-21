
import http, { get } from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from 'k6/data';

const tokenPostConnexion = new SharedArray('user token', function () {
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

//Must do : 
// Settin' numbers users, trafics and duration  ✅
// load and overload testin params              ✅ 
// Printing a local repport on the metrics     
//  Interpretations metrics, Temps de latence Nombre de requete par seconde 
// Jenckins..search about 

//Reload
// export let options = {
//   stages: [
//     { target: 10, duration: '30s' },
//     { target: 50, duration: '1m' },
//     { target: 10, duration: '30s' },
//   ],
// };

export const options = {
  discardResponseBodies: true,
  scenarios: {
    contacts: {
      executor: 'constant-arrival-rate',

      // How long the test lasts
      duration: '60s',

      // How many iterations per timeUnit
      rate: 10,

      // Start `rate` iterations per second
      timeUnit: '1s',

      // Pre-allocate 2 VUs before starting the test
      preAllocatedVUs: 5,

      // Spin up a maximum of 50 VUs to sustain the defined
      // constant arrival rate.
      maxVUs: 20,
    },
  },
};

// //Load 
// export let options = {
//   vus: 2, 
//   duration: "60s", 
// };

export default function() {

  let headers = {
    Authorization: `Bearer ${tokenPostConnexion[0].tokenConnexion}`,
    __app_key__: appKey,
    ...headersData
  }
  
//API Generate Header est une forme d'authentification qui genere un token pour les autres services 
let GetHeaderRes = http.get(`${getHeaderUrl[0].preProdHeader}/common/generate-header?msisdn=${msisdn[0].msisdn1}&pin=${pin[0].pin1}&deviceId=${duid[0].duid1}`, { headers });
check(GetHeaderRes, {
  "Réponse GetHeader HTTP Status 200 reçu": (r) => r.status === 200,
});

//API permet (je pense) de verifier les forfait disponible 
let checkForfaitRes = http.get(`${getHeaderUrl[0].preProdHeader}/v1/mob/forfait/check-forfait/${msisdn}`, { headers });    
check(checkForfaitRes, {
  "Reponse check-forfait Statut 200 reçu": (r) => r.status === 200
  // "Réponse contient au moins un forfait": (r) => {
  //   try {
  //     let jsonResponse = JSON.parse(r.body);
  //     return jsonResponse.length >= 1;
  //   } catch (e) {
  //     return false;
  //   }
  // },
});

//API permet 
    let GetBundleFullRes = http.get(`${getHeaderUrl[0].preProdHeader}/v1/mob/forfait/get-bundle/FULL`, { headers });    
    check(GetBundleFullRes, {
      "Reponse des Bundle Full status 200 reçu": (r) => r.status === 200,
      // "response is not empty": (r) => r.body.length > 0,
    });

    
//API permet 
let GetBundleLiteRes = http.get(`${getHeaderUrl[0].preProdHeader}/v1/mob/forfait/get-bundle/LITE`, { headers });    
check(GetBundleLiteRes, {
  "Reponse des Bundle LITE status 200 reçu": (r) => r.status === 200,
  // "response is not empty": (r) => r.body.length > 0,
});    


//API permet 
  let ListSubscriptionRes = http.get(`${getHeaderUrl[0].preProdHeader}/v1/mob/forfait/list-subscriptions/${msisdn[0].msisdn1}?sort=start_date_time,desc`, { headers: headers });
  check(ListSubscriptionRes, {
    "Reponse Check substriction Statut 200 reçu": (r) => r.status === 200,
  });

//API permet 
  let GetTransactionHistoryRes = http.get(`${getHeaderUrl[0].preProdHeader}/v1/mob/omy/last-transactions?page=0&size=20`, { headers });
  check(GetTransactionHistoryRes, {
    "Reponse Get Transactionn History Statut 200 reçu": (r) => r.status === 200,
  //   "✅ La réponse contient des transactions": (r) => {
  //     try {
  //       let jsonResponse = JSON.parse(r.body);
  //       return jsonResponse.liste && jsonResponse.liste.length > 0;
  //     } catch (e) {
  //       return false;
  //     }
  //   },
  //   "✅ Nombre de pages supérieur à 1": (r) => {
  //     try {
  //       let jsonResponse = JSON.parse(r.body);
  //       return jsonResponse.nbpages > 1;
  //     } catch (e) {
  //       return false;
  //     }
  //   },
   });

  sleep(1); // Pause d'une seconde entre les itérations
}