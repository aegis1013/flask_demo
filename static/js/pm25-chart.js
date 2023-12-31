const Chart1 = echarts.init(document.getElementById('main'));
const Chart2 = echarts.init(document.getElementById('six-county'));
const Chart3 = echarts.init(document.getElementById('county'));
const selectCountyEl = document.querySelector('#selectCounty');

selectCountyEl.addEventListener("change", () => {
    console.log(selectCountyEl.value);
    drawCountyPM25(selectCountyEl.value);
});

window.onresize = function () {
    Chart1.resize();
    Chart2.resize();
    Chart3.resize();
};

//繪製圖形
drawPM25();

function echartPic(chart, title, Label, xData, yData, color = "#00008b") {
    let option = {
        title: {
            text: title
        },
        tooltip: {},
        legend: {
            data: [Label]
        },
        xAxis: {
            data: xData
        },
        yAxis: {},
        series: [
            {
                itemStyle: {
                    color: color
                },
                name: Label,
                type: 'bar',
                data: yData
            }
        ]
    };

    chart.setOption(option);
}

function echartSixPm25(result) {
    let option = {
        title: {
            text: '六都Pm2.5平均值'
        },
        tooltip: {},
        legend: {
            data: ['PM2.5']
        },
        xAxis: {
            data: Object.keys(result),
        },
        yAxis: {},
        series: [
            {
                itemStyle: {
                    color: '#b8008b'
                },
                name: 'PM2.5',
                type: 'bar',
                data: Object.values(result)
            }
        ]
    };

    myChart2.setOption(option);
}

function echartPic1(result) {

    // 指定图表的配置项和数据
    var option = {
        title: {
            text: result['title']
        },
        tooltip: {},
        legend: {
            data: ['PM2.5']
        },
        xAxis: {
            data: result['xData']
        },
        yAxis: {},
        series: [
            {
                name: 'PM2.5',
                type: 'bar',
                data: result['yData']
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    Chart1.setOption(option);
}

function echartPic2(result) {
    var option;

    // prettier-ignore
    let dataAxis = result['xData'];
    // prettier-ignore
    let data = result['yData'];
    let yMax = 500;
    let dataShadow = [];
    for (let i = 0; i < data.length; i++) {
        dataShadow.push(yMax);
    }
    option = {
        title: {
            text: result['result'],
            subtext: '功能範例：漸層顏色、陰影、按一下縮放'
        },
        xAxis: {
            data: dataAxis,
            axisLabel: {
                inside: true,
                color: '#fff'
            },
            axisTick: {
                show: false
            },
            axisLine: {
                show: false
            },
            z: 10
        },
        yAxis: {
            axisLine: {
                show: false
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                color: '#999'
            }
        },
        dataZoom: [
            {
                type: 'inside'
            }
        ],
        series: [
            {
                type: 'bar',
                showBackground: true,
                itemStyle: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        { offset: 0, color: '#83bff6' },
                        { offset: 0.5, color: '#188df0' },
                        { offset: 1, color: '#188df0' }
                    ])
                },
                emphasis: {
                    itemStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: '#2378f7' },
                            { offset: 0.7, color: '#2378f7' },
                            { offset: 1, color: '#83bff6' }
                        ])
                    }
                },
                data: data
            }
        ]
    };
    // Enable data zoom when user click bar.
    const zoomSize = 6;
    Chart2.on('click', function (params) {
        console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
        myChart.dispatchAction({
            type: 'dataZoom',
            startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
            endValue:
                dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
        });
    });

    option && Chart1.setOption(option);
}

function drawPM25() {
    Chart1.showLoading();
    Chart2.showLoading();
    //ajax
    $.ajax(
        {
            url: "/pm25-json",
            type: "GET",
            dataType: "json",
            // success:()=>
            success: (result) => {
                Chart1.hideLoading();
                Chart2.hideLoading();
                console.log(result);
                echartPic1(result);
                echartPic(Chart1, result["title"], "PM2.5", result['xData'], result['yData']);
                echartPic(Chart2, "六都PM2.5平均值", "PM2.5",
                    Object.keys(result["sixData"]),
                    Object.values(result["sixData"]),
                    "#ff69b4"
                );
                drawCountyPM25(result["county"]);
                // echartSixPm25(result["sixData"])
            },
            error: () => {
                alert("取得資料失敗!");
            }
        }

    )
}

function drawCountyPM25(county) {
    Chart3.showLoading();
    //ajax
    $.ajax(
        {
            url: "/county-pm25-json/" + county,
            type: "GET",
            dataType: "json",
            // success:()=>
            success: (result) => {
                Chart3.hideLoading();
                if (!result['success']) {
                    county = county + "輸入不正確.."
                }
                console.log(result);
                // echartSixPm25(result["sixData"])
                echartPic(Chart3, county, "PM2.5",
                    Object.keys(result["pm25"]),
                    Object.values(result["pm25"]),
                    '#ffa500'
                )
            },
            error: () => {
                alert("取得資料失敗!");
            }
        }

    )
}

