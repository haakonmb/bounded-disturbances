import http from "k6/http";
import { Trend, Rate, Counter } from "k6/metrics";

export let TrendRTT = new Trend("RTT");
const myOkRate = new Rate("200 OK rate");
const myOkCounter = new Counter("200 OK count");

export let options = {
  vus       : 100,
  duration  : "300s",
  rps       : 2000, //max requests per second, increase to go faster
  insecureSkipTLSVerify : true, //ignore that localhost cert doesn't match host.docker.internal
  thresholds: {
    '200 OK rate': ['rate>0.8'],
    '200 OK count': ['count>200']
 }
}

let params = {
  headers: {
    "Accept": "*/*",
    "Accept-Encoding": "gzip",
    "User-Agent" : "nrktv-k6-loadtest"
  },
  timeout: 20000 //ms
}

// The idea in this challenge is to try to explain what happens with GC
// We need to set up a chart of GC0, 1 and 2 in Grafana
// and then a feature toggle
// Then we can run some experiments and disucss

export default function() {
    
  let res = http.get("http://172.17.0.1:5000/weatherforecast_challenge20", params);
  TrendRTT.add(res.timings.duration);
  let resOk = res.status === 200;
  myOkRate.add(resOk);
  myOkCounter.add(resOk);
  
};