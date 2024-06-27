
const URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false"
let dataArr = []
let filteredData = []
let chart;

const dataList = document.querySelector("#data-container")
const coinChart = document.querySelector("#coin-chart")
const topCoin = document.querySelector("#topCoin")

const min =document.querySelector("#min")
const max= document.querySelector("#max")
let minValue =min.value
let maxValue = max.value

max.setAttribute("min", minValue)
document.querySelector("#minLabel").innerHTML=`Min: ${minValue}`
document.querySelector("#maxLabel").innerHTML=`Max: ${maxValue}`

// *********functions*********

const handleTopCoin = () =>{
    let topCoinName = dataArr[0].name
    topCoin.innerHTML=`the current top coin is ${topCoinName}`
}


const displayDataList = () => {
    dataList.innerHTML = ""
    for(let i =0 ; i < dataArr.length ; i++) {

        let a = document.createElement("a")
        a.setAttribute("href",`https://www.google.com/search?q=${dataArr[i].name}`)
        a.setAttribute("target", "_blank")
        a.style.textDecoration = "none";
        
        let div = document.createElement("div")
        div.setAttribute("class", "coin-box")
        
        let name = document.createElement("p")
        name.innerHTML = i+1 + ". "+ dataArr[i].name

        let market_cap = document.createElement("p")
        market_cap.innerHTML = "Market Cap: "+ dataArr[i].market_cap
    
        div.append(name,market_cap)
        a.append(div)
        dataList.append(a)
    }
}


const handleFilter = () => {
    minValue =min.value
    maxValue = max.value

    min.setAttribute("max", maxValue)
    max.setAttribute("min", minValue)
    document.querySelector("#minLabel").innerHTML = `Min: ${minValue}`;
    document.querySelector("#maxLabel").innerHTML = `Max: ${maxValue}`
    
    //! */ i had some rendering issues in the dynamic chart filter.
    
    // filteredData = dataArr.filter(val => val.market_cap >= minValue && val.market_cap <= maxValue)
    // if(filteredData.length > 0){
    //     handleApexChart()
    // } else {
    //     if(chart) {
    //         chart.destroy()
    //     }
    // }
}


const handleApexChart = () => {
    let categories = filteredData.map(val => val.name);
    let data = filteredData.map(val => val.market_cap);
    let options= {
        chart: {
            type:"bar",
            width:"1000",
            height:"500",
            foreColor:"rgb(216, 225, 235)",
            id: "basic-bar",
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
                animateGradually: {
                    enabled: true,
                    delay: 150
                },
                dynamicAnimation: {
                    enabled: true,
                    speed: 300
                }
            },
            dropShadow: {
              enabled: true,
              top: 0,
              left: 0,
              blur: 1,
              opacity: 0.5
            },
        },
        plotOptions: {
            bar: {
                distributed: true, 
                horizontal: true,
                barHeight: '85%',
            },
        },
        fill: {
          colors: [function({value, seriesIndex, w}) {
              if (seriesIndex < 1) {
                  return '#A7E6FF'
              } else {
                  return '#37B7C3'
              }
            }],
            type: "gradient",
            gradient: {
              shadeIntensity: 0.2,
              opacityFrom: 0.7,
              opacityTo: 0.7,
              stops: [0, 50, 100],
            }
        },
        xaxis: {
          categories: categories
        },
        dataLabels: {
          enabled: false
        },
        legend: {
          show: false
        },
        series: [
            {
            name: "Market Cap",
            data: data
            }
        ]
    }

    if(chart){
        chart.destroy()
    }
    chart = new ApexCharts(document.querySelector('#coinChart'), options);
    chart.render();
}


const fetchData = async () => {
    let res = await fetch(URL)
    let data = await res.json()
    for(let i = 0; i < data.length; i++) {
        dataArr.push({name: data[i].name, market_cap: data[i].market_cap})
    }
    filteredData = [...dataArr]
    console.log(dataArr);
    handleTopCoin()
    displayDataList()
    handleApexChart()
    return dataArr
}

fetchData()


min.addEventListener("input",handleFilter)
max.addEventListener("input",handleFilter)

