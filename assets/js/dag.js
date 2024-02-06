function create_dag(
  clique_type,
  clique_id,
  element_id = "dag",
  ignore_size = false,
) {
  return fetch("data/" + clique_type + "/" + clique_id + ".json")
    .then((response) => response.json())
    .then((clique_data) => {
      if (clique_data.nodes.length > 50 && !ignore_size) {
        console.log("Clique too large to render");
        return false;
      }

      function autoFontSize() {
        let width = document.getElementById(element_id).offsetWidth;
        let height = document.getElementById(element_id).offsetHeight;
        let new_size = Math.round(
          Math.sqrt(width * width + height * height) /
            (60 + Math.log(clique_data.nodes.length)),
        );
        new_size = Math.min(new_size, 20);
        return new_size;
      }
      function autoSymbolSize() {
        let width = document.getElementById(element_id).offsetWidth;
        let height = document.getElementById(element_id).offsetHeight;
        let new_size = Math.round(
          Math.sqrt(width * width + height * height) /
            (12 + Math.log(clique_data.nodes.length)),
        );
        new_size = Math.min(new_size, 60);
        return new_size;
      }
      function autoEdgeLength() {
        let width = document.getElementById(element_id).offsetWidth;
        let height = document.getElementById(element_id).offsetHeight;
        let new_size = Math.round(
          Math.sqrt(width * width + height * height) /
            (0.75 + Math.log(clique_data.nodes.length)),
        );
        new_size = Math.min(new_size, 300);
        return new_size;
      }

      var chartDom = document.getElementById(element_id);
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: clique_id,
          left: "center",
          textStyle: {
            fontSize: autoFontSize() + 10,
            fontWeight: "bolder",
            color: "#333",
          },
        },
        tooltip: {
          trigger: "item",
          triggerOn: "mousemove",
          formatter: "{b}",
          backgroundColor: "#F6F8FC",
          borderColor: "#8C8D8E",
          borderWidth: 1,
          padding: [3, 3, 3, 3],
          textStyle: {
            color: "#4C5058",
            fontSize: autoFontSize(),
          },
        },
        visualMap: {
          type: "continuous",
          min: -165,
          max: 165,
          seriesIndex: 0,
          title: {
            text: "Signed log10 meta-p",
            left: "center",
            top: "bottom",
          },
          text: [
            "Signed log10 meta-p\n\nHigher in Tumor vs. Normal",
            "Lower in Tumor vs. Normal",
          ],
          precision: 3,
          inRange: {
            color: [
              "#67001f",
              "#b2182b",
              "#d6604d",
              "#f4a582",
              "#fddbc7",
              "#f7f7f7",
              "#d1e5f0",
              "#92c5de",
              "#4393c3",
              "#2166ac",
              "#053061",
            ].reverse(),
          },
        },
        series: [
          {
            type: "graph",
            name: "Clique " + clique_id,
            draggable: clique_data.nodes.length < 100,
            layout: "force",
            nodes: clique_data.nodes,
            links: clique_data.edges,
            coordinateSystem: null,
            roam: true,
            symbolSize: autoSymbolSize(),
            label: {
              show: true,
              position: "inside",
              fontSize: autoFontSize(),
              padding: [3, 3, 3, 3],
              verticalAlign: "middle",
              color: "#4C5058",
              backgroundColor: "#F6F8FC",
              borderColor: "#8C8D8E",
              borderWidth: 1,
              borderRadius: 4,
            },
            force: {
              repulsion: 300,
              edgeLength: autoEdgeLength(),
              friction: 0.05,
            },
            itemStyle: {
              borderColor: "#000",
              borderWidth: 1,
            },
            lineStyle: {
              width: clique_data.edges.length < 100 ? 1 : 0.5,
            },
            emphasis: {
              focus: "none",
              itemStyle: {
                borderColor: "#000",
                borderWidth: 2,
                color: "#FFA505",
              },
            },
          },
        ],
      };
      option && myChart.setOption(option);
      window.addEventListener("resize", function () {
        myChart.resize();
        myChart.setOption({
          series: {
            label: {
              textStyle: {
                fontSize: autoFontSize(),
              },
            },
            symbolSize: autoSymbolSize(),
            force: {
              edgeLength: autoEdgeLength(),
            },
          },
        });
      });
      return myChart;
    });
}

function update_dag(chart, clique_type, clique_id) {
  return fetch("data/" + clique_type + "/" + clique_id + ".json")
    .then((response) => response.json())
    .then((clique_data) => {
      if (clique_data.nodes.length > 50) {
        // chart with text "Too many nodes to display."
        chart.setOption({
          // vertically center title
          title: {
            text: "Too many nodes to display.",
            top: "middle",
          },
          series: [
            {
              nodes: [],
              links: [],
            },
          ],
        });
        return false;
      }
      chart.setOption({
        title: {
          text: clique_id,
          top: "top",
        },
        series: [
          {
            nodes: clique_data.nodes,
            links: clique_data.edges,
          },
        ],
      });
      return chart;
    });
}
