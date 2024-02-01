function dense(echarts, config = {}) {
  data_path = config.data_path || "data/dense_modules.json";
  element_id = config.element_id || "chart";

  fetch(data_path)
    .then((res) => res.json())
    .then((dense_modules) => {
      for (let i = 0; i < dense_modules.length; i++) {
        let max = Math.max(Math.sqrt(dense_modules[i].data.nodes.length));
        for (let j = 0; j < dense_modules[i].data.nodes.length; j++) {
          dense_modules[i].data.nodes[j].x = (j % max) / 10000;
          dense_modules[i].data.nodes[j].y = Math.floor(j / max) / 10000;
        }
      }
      let max_length = Math.max(Math.sqrt(dense_modules.length));
      var myChart = echarts.init(document.getElementById(element_id));
      var option = {
        title: {
          text: "Dense Modules",
          top: "top",
        },
        roam: true,
        zoom: 0.01,
        series: dense_modules.map((module, idx) => {
          return {
            roam: true,
            type: "graph",
            layout: "none",
            left: ((idx % max_length) * 100) / max_length + "%",
            top: (Math.floor(idx / max_length) * 100) / max_length + "%",
            nodes: module.data.nodes,
            links: module.data.edges,
            name: module.name,
          };
        }),
      };
      option && myChart.setOption(option, "chart");
    });
}

function create_dense_dag(
  clique_type,
  clique_id,
  element_id = "dag",
  ignore_size = true,
) {
  console.log(element_id);
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
            (40 + Math.log(clique_data.nodes.length)),
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
        series: [
          {
            type: "graph",
            name: "Clique " + clique_id,
            draggable: false,
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
              initLayout: "circular",
              layoutAnimation: false,
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
