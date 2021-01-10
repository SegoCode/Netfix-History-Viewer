window.onload = function() {
  var fileInput = document.getElementById("fileInput");
  var table = document.getElementById("dataTable");
  fileInput.addEventListener("change", function(e) {
    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.readAsText(file);

    //On load history
    reader.onload = function(e) {
      var auxNum = 0;
      var dataLines = this.result.split("\n");


      //Get series and Watched episodes
      var series = [];
      var times = [];
      for (var line = 1; line < dataLines.length - 1; line++) {
        var name = parserName(dataLines[line]);
        if (!series.includes(name)) {
          series.push(name);
          times[auxNum] = 1;
          auxNum = auxNum + 1;
        } else {
          times[series.indexOf(name)] = times[series.indexOf(name)] + 1;
        }
      }

      //Get visionate times
      dataLines.reverse();
      var data = [];
      var lastYear;
      auxNum = 0;
      lastYear = parserLineToYear(dataLines[1]);
      for (var line = 1; line < dataLines.length - 1; line++) {
        var yearNew = parserLineToYear(dataLines[line]);

        if (lastYear != yearNew) {
          data.push({
            "year": lastYear + "",
            "episodes": auxNum
          });
          for (var j = 1; j < yearNew - lastYear; j++) {
            data.push({
              "year": lastYear + j + "",
              "episodes": 0
            });
          }

          lastYear = yearNew;
          auxNum = 1;
        } else {
          auxNum = auxNum + 1;
        }
      }
      loadChart(data);

      //load table
      for (i = 0; i < series.length; i++) {
        var newRow = table.insertRow(table.length);
        newRow.insertCell(0).innerHTML = series[i];
        newRow.insertCell(1).innerHTML = times[i];
      }

    };
  });
};

function parserLineToYear(stringDataLine) {
  stringDataLine = (stringDataLine.split("\",\"")[1]).replace(/"/g, "");
  return parseInt("20" + stringDataLine.split("/")[2]);
}



function parserName(StringLine) {
  if (StringLine.includes(":")) {
    StringLine = StringLine.split(":")[0];
  } else {
    StringLine = StringLine.split(",")[0];
  }
  StringLine = StringLine.replace(/"/g, "");

  return StringLine;
}


function loadChart(data) {

  am4core.useTheme(am4themes_animated);

  var chart = am4core.create("chartdiv", am4charts.XYChart);

  chart.data = data;

  var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
  categoryAxis.renderer.grid.template.location = 0;
  categoryAxis.renderer.ticks.template.disabled = true;
  categoryAxis.renderer.line.opacity = 0;
  categoryAxis.renderer.grid.template.disabled = true;
  categoryAxis.renderer.minGridDistance = 40;
  categoryAxis.dataFields.category = "year";
  categoryAxis.startLocation = 0.4;
  categoryAxis.endLocation = 0.6;


  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.tooltip.disabled = true;
  valueAxis.renderer.line.opacity = 0;
  valueAxis.renderer.ticks.template.disabled = true;
  valueAxis.min = 0;

  var lineSeries = chart.series.push(new am4charts.LineSeries());
  lineSeries.dataFields.categoryX = "year";
  lineSeries.dataFields.valueY = "episodes";
  lineSeries.tooltipText = "episodes: {valueY.value}";
  lineSeries.fillOpacity = 0.5;
  lineSeries.strokeWidth = 3;
  lineSeries.propertyFields.stroke = "lineColor";
  lineSeries.propertyFields.fill = "lineColor";

  var bullet = lineSeries.bullets.push(new am4charts.CircleBullet());
  bullet.circle.radius = 6;
  bullet.circle.fill = am4core.color("#fff");
  bullet.circle.strokeWidth = 3;

  chart.cursor = new am4charts.XYCursor();
  chart.cursor.behavior = "panX";
  chart.cursor.lineX.opacity = 0;
  chart.cursor.lineY.opacity = 0;

  chart.scrollbarX = new am4core.Scrollbar();
  chart.scrollbarX.parent = chart.bottomAxesContainer;

  document.getElementById("chartdiv").style.display = "";
}
