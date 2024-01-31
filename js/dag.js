
function create_dag(clique_type, clique_id, element_id = 'dag') {

    

    fetch('data/' + clique_type + '/' + clique_id + '.json')
        .then(response => response.json())
        .then(clique_data => {
            if (clique_data.nodes.length > 1000) {
                alert("Too many nodes to display");
                return;
            }

            function autoFontSize() {
                let width = document.getElementById(element_id).offsetWidth;
                let height = document.getElementById(element_id).offsetHeight;
                let newFontSize = Math.round(Math.sqrt(width * width  + height * height) / (10 * Math.log(clique_data.nodes.length)));
                return newFontSize;
            };
            function autoSymbolSize() {
                let width = document.getElementById(element_id).offsetWidth;
                let height = document.getElementById(element_id).offsetHeight;
                let newFontSize = Math.round(Math.sqrt(width * width  + height * height)/ (5 * Math.log(clique_data.nodes.length)));
                return newFontSize;
            };
            function autoEdgeLength() {
                let width = document.getElementById(element_id).offsetWidth;
                let height = document.getElementById(element_id).offsetHeight;
                let newFontSize = Math.round(Math.sqrt(width * width  + height * height) / (1 * Math.log(clique_data.nodes.length)));
                return newFontSize;
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
                    trigger: 'item',
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