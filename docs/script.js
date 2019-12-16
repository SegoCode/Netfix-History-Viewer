window.onload = function() {
  var fileInput = document.getElementById("fileInput");
  var fileDisplayArea = document.getElementById("fileDisplayArea");
  fileInput.addEventListener("change", function(e) {
    var file = fileInput.files[0];
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(e) {
      var series = [];
      var times = [];
      var auxNum = 0;
      var lines = this.result.split("\n");
      for (var line = 1; line < lines.length - 1; line++) {
        var name = parser(lines[line]);
        if (!series.includes(name)) {
          series.push(name);
          times[auxNum] = 1;
          auxNum = auxNum + 1;
        } else {
          times[series.indexOf(name)] = times[series.indexOf(name)] + 1;
        }
      }
      console.log(series);
      console.log(times);
      createPie(series, times);
      for (i = 0; i < series.length; i++) {
        var newRow = table.insertRow(table.length);
        newRow.insertCell(0).innerHTML = series[i];
        newRow.insertCell(1).innerHTML = times[i];
      }
    };
  });
};

function parser(data) {
  if (data.includes(":")) {
    data = data.split(":")[0];
  } else {
    data = data.split(",")[0];
  }
  data = data.replace(/"/g, "");
  return data;
}

// Chart.js
function createPie(labels, views) {
  var canvasP = document.getElementById("pieChart");
  var ctxP = canvasP.getContext("2d");
  var colors = generateColors(views);
  var myPieChart = new Chart(ctxP, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          backgroundColor: colors,
          data: views
        }
      ]
    },
    options: {
      legend: {
        display: false
      }
    }
  });
}

function generateColors(views) {
  var colors = [];
  for (i = 0; i < views.length; i++) {
    colors[i] = getRandomColor();
  }
  return colors;
}

function getRandomColor() {
  var letters = "0123456789ABCDEF".split("");
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Collapse panel
var coll = document.getElementsByClassName("collapsible");
for (var i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}