const http = require("http");
const fs = require("fs");
const requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8");
const replaceval=(tempval,org)=>{
    let temperature=tempval.replace("{%tempval%}",(org.main.temp-272.0).toPrecision(4));
     temperature=temperature.replace("{%tempmin%}",(org.main.temp_min-272.0).toPrecision(4));
temperature=temperature.replace("{%tempmax%}",(org.main.temp_max-272.0).toPrecision(4));
temperature=temperature.replace("{%city%}",org.name);
temperature=temperature.replace("{%country%}",org.sys.country);
temperature=temperature.replace("{%temperature%}",org.main.temp);
temperature=temperature.replace("{%tempval%}",org.main.temp);
return temperature;
};
const server = http.createServer((req, res) => {
  if (req.url === "/") {
    requests(
      "http://api.openweathermap.org/data/2.5/weather?q=Pune&appid=870e8dca4891b796b160ec7ff2a8badd"
    )
      .on("data", (chunk) => {
        const objData = JSON.parse(chunk);
        const arrData = [objData];
        // console.log(arrData[0].main.temp);
        const realTimedata=arrData.map((val)=>
            replaceval(homeFile,val)).join("");
            res.write(realTimedata);
            // console.log(realTimedata);
      })
      .on("end", (err) => {
        if (err) return console.log("Connection closed due to errors", err);
        res.end();
      });
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server is listening on http://localhost:8000");
});
