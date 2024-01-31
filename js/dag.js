
function create_dag(clique_type, clique_id, element_id = 'dag') {
    return fetch('data/' + clique_type + '/' + clique_id + '.json')
        .then(response => response.json())
        .then(clique_data => {
            if (clique_data.nodes.length > 50) {
                return false;
            }

            // add 
            for (let i = 0; i < clique_data.edges.length; i++) {
                clique_data.edges[i].emphasis = {"disabled": true};
            }
            function autoFontSize() {
                let width = document.getElementById(element_id).offsetWidth;
                let height = document.getElementById(element_id).offsetHeight;
                let new_size = Math.round(Math.sqrt(width * width  + height * height) / (40 + Math.log(clique_data.nodes.length)));
                new_size = Math.min(new_size, 20);
                return new_size;
            };
            function autoSymbolSize() {
                let width = document.getElementById(element_id).offsetWidth;
                let height = document.getElementById(element_id).offsetHeight;
                let new_size = Math.round(Math.sqrt(width * width  + height * height)/ (12 + Math.log(clique_data.nodes.length)));
                new_size = Math.min(new_size, 60);
                return new_size;
            };
            function autoEdgeLength() {
                let width = document.getElementById(element_id).offsetWidth;
                let height = document.getElementById(element_id).offsetHeight;
                let new_size = Math.round(Math.sqrt(width * width  + height * height) / (0.75 + Math.log(clique_data.nodes.length)));
                new_size = Math.min(new_size, 300);
                return new_size;
            };


            var chartDom = document.getElementById(element_id);
            var myChart = echarts.init(chartDom);
            var option;

            option = {
                title: {
                    text: clique_id,
                    left: 'center',
                    textStyle: {
                        fontSize: autoFontSize() + 10,
                        fontWeight: 'bolder',
                        color: '#333'
                    }
                },
                tooltip: {
                    trigger: 'none',
                    triggerOn: 'mousemove',
                    formatter: "{b}",
                    backgroundColor: '#F6F8FC',
                    borderColor: '#8C8D8E',
                    borderWidth: 1,
                    padding: [3, 3, 3, 3],
                    textStyle: {
                        color: '#4C5058',
                        fontSize: autoFontSize()
                    }
                },
                series: [
                    {
                        type: 'graph',
                        name: "Clique " + clique_id,
                        draggable: clique_data.nodes.length < 100,
                        layout: 'force',
                        nodes: clique_data.nodes,
                        links: clique_data.edges,
                        coordinateSystem: null,
                        roam: true,
                        symbolSize: autoSymbolSize(),
                        label: {
                            show: true,
                            position: 'inside',
                            fontSize: autoFontSize(),
                            padding: [3, 3, 3, 3],
                            verticalAlign: "middle",
                            color: '#4C5058',
                            backgroundColor: '#F6F8FC',
                            borderColor: '#8C8D8E',
                            borderWidth: 1,
                            borderRadius: 4,

                        },
                        force: {
                            repulsion: 300,
                            edgeLength: autoEdgeLength(),
                            friction: 0.03
                        },
                        lineStyle: {
                            width: clique_data.edges.length < 100 ? 0.5 : 0.25
                        },
                        edgeSymbol: ['none', 'arrow'],
                        edgeSymbolSize: [0, 0],
                        emphasis: {
                            focus: 'none',
                            itemStyle: {
                                borderColor: '#000',
                                borderWidth: 2,
                                color: '#FFA500'
                            }
                        }
                    }
                ]
            };
            option && myChart.setOption(option);
            window.addEventListener('resize', function () {
                myChart.resize();
                myChart.setOption({
                    series: {
                        label: {
                            textStyle: {
                                fontSize: autoFontSize()
                            }
                        },
                        symbolSize: autoSymbolSize(),
                        force: {
                            edgeLength: autoEdgeLength()
                        }
                    }
                });
            });
            return myChart;
        });
}

function update_dag(chart, clique_type, clique_id) {
    return fetch('data/' + clique_type + '/' + clique_id + '.json')
        .then(response => response.json())
        .then(clique_data => {
            if (clique_data.nodes.length > 50) {
                // chart with text "Too many nodes to display."
                chart.setOption({ // vertically center title
                    title: {
                        text: "Too many nodes to display.",
                        top: 'middle',
                    },
                    series: [
                        {
                            nodes: [],
                            links: []
                        }
                    ]
                });
                return false;
            }
            for (let i = 0; i < clique_data.edges.length; i++) {
                clique_data.edges[i].emphasis = {"disabled": true};
            }
            chart.setOption({
                title: {
                    text: clique_id,
                    top: "top"
                },
                series: [
                    {
                        nodes: clique_data.nodes,
                        links: clique_data.edges
                    }
                ]
            });
            return chart;
        });
}