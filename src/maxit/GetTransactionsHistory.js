import http from "k6/http";
import { check, sleep } from "k6";

export let options = {
  vus: 1, // 1 utilisateur virtuel
  duration: "5s", // Test pendant 5 secondes
};

// Variables globales
let suguUrl =
  "https://sugu-preprod-dsiosnsugu-isoprod.apps.malaw-prod.orange-sonatel.com/api";
let msisdn = "771292317";
let token = "UzYQ5YYjWVCRWESCjQz1F3HqqKbvJrsNpnwf7wT4pqIoaJWkdGPaUi+A4YO7HeKYmrBS98qH35DR9cBqPNKW7OEiGVB96ZQUZiOS3lPWVhXPdNMoA+2oJBARoqvDtFiJMqdVGjgWJCRiU5tIjuWnwRdu0g2avePxkY8XzzppJjVDHA6t+DnGSMXeVdhHMXR0J2m9uGeLCDTSztDWQNPk/1esB9VYwz3BYQLiH8at5N4EcuhZLgGPjBedcUZLbnJQ24Xsovsw0PG8wELdZB/pqbLgBY7O08YEMID1j2hPRz6XEEGcU8PYsqhmggEjgbzBubd+U6yE6UpTLq/8hpicSITCBMiroxInvxXUrMjbK4AOW+8c9R/CucFSjnyeY82VfR5YsSyGR/Tsw+40bukm/NPLg5bvaIPdj9gQBbEI+HhlRnQlFycp1MAFMxTtHKHk6znWx9t7Rg/Z0QfeG4F9qMup5Ny0/t8fqDBdpTOCoPK2llSYaKFvPfPu2n6qNBrqvDnPyEZB/lEIwBwMsnXKbOfnhXiXnzv0EfyVhCFHa/I+HNpI0a5xcnaByhoD1JHxfEMRgeJF+2G8ocgVZGJR2g==";
let duid = "CC0B1D93-0170-48A7-A218-B803A9CE584F";
let appKey = "w256tCtjQLjiD3jQ5Q3TXL1FBBBjT1DOLBCBy1y3Bt3QB3iTTLC35CiBXTDBXL13DDjOCF33Oi1D3jBOQCQ1LtLXQLDtLiQXQ3LiQtBj5TyTOyT5T5yiQD31y3TXTy3QOTTXyCitB5yLjC3FFFO5XL3XTLjXB5jBBXTOXQD5jLBQOOt511Q5TttTLDyXtyDiQXCFyjXjTC3QCy3Qt1tt1TjL3FTDitF1OQCLF3QjiB5T3CF5FXTyDtLiLF3X135TiBC50a__3";
let packageName = "com.ml.samea.mobile.osn";
let appVersion = "14.1.0";

export default function() {
  let url = `${suguUrl}/v1/mob/omy/last-transactions?page=0&size=20`;

  let headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json; charset=utf-8",
    __oms_user_language__: "fr",
    __oms_terminal_version__:
      "5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, comme Gecko) Chrome/110.0.0.0 Safari/537.36",
    __oms_terminal_manufacturer__: "Google Inc.",
    __oms_terminal_uuid__: duid,
    __oms_username__: msisdn,
    "User-Agent":
      "Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, comme Gecko) Chrome/90.0.4430.91 Mobile Safari/537.36",
    __msisdn__: msisdn,
    __oms_terminal_os__: "ios",
    __oms_terminal_model__: "MacIntel",
    __app_version_name__: "SAMEAI",
    __app_version__: appVersion,
    AppVersion: appVersion,
    Accept: "*/*",
    __package_name__: packageName,
    __app_key__: appKey,
  };

  //   let payload = JSON.stringify({
  //     msisdn: msisdn,
  //     secret: "",
  //     count: 5,
  //     page: 0,
  //     size: 5,
  //   });

  let res = http.get(url, { headers });

  check(res, {
    " Statut 200 reçu": (r) => r.status === 200,
    "✅ La réponse contient des transactions": (r) => {
      try {
        let jsonResponse = JSON.parse(r.body);
        return jsonResponse.liste && jsonResponse.liste.length > 0;
      } catch (e) {
        return false;
      }
    },
    "✅ Nombre de pages supérieur à 1": (r) => {
      try {
        let jsonResponse = JSON.parse(r.body);
        return jsonResponse.nbpages > 1;
      } catch (e) {
        return false;
      }
    },
  });

  sleep(1);
}
