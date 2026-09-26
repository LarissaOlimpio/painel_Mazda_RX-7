const Rx7App = (function () {
  let searchCount = 0;
  let lastKnownPowerHp = null;

  const formatCurrency = (value) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatNumber = (value, suffix = "") => `${value}${suffix}`;

  function renderHero(data) {
    const { featured, model, engine } = data;
    const { year, trim, powerHp, zeroToHundredS, topSpeedKmh } = featured;
    lastKnownPowerHp = powerHp;

    document.getElementById("hero-title").textContent = model;
    document.getElementById("hero-subtitle").textContent =
      `${trim} · ${year} · ${engine}`;

    document.getElementById("stat-power").textContent = formatNumber(
      powerHp,
      " hp",
    );
    document.getElementById("stat-accel").textContent = formatNumber(
      zeroToHundredS,
      " s",
    );
    document.getElementById("stat-topspeed").textContent = formatNumber(
      topSpeedKmh,
      " km/h",
    );
  }

  function renderPowerTorqueChart(curve) {
    const categories = curve.map((point) => point.rpm);
    const powerValues = curve.map((point) => point.hp);
    const torqueValues = curve.map((point) => point.torqueNm);

    Highcharts.chart("power-chart", {
      chart: { type: "line", backgroundColor: "transparent" },
      title: { text: null },
      xAxis: {
        categories: categories,
        title: { text: "RPM" },
        gridLineColor: "rgba(255,255,255,0.06)",
      },
      yAxis: [
        {
          title: { text: "Power (hp)" },
          gridLineColor: "rgba(255,255,255,0.06)",
        },
        {
          title: { text: "Torque (Nm)" },
          opposite: true,
          gridLineColor: "rgba(255,255,255,0.0)",
        },
      ],
      tooltip: { shared: true },
      legend: { itemStyle: { color: "#c7cbd1" } },
      series: [
        {
          name: "Power (hp)",
          data: powerValues,
          color: "#ff5a3c",
          yAxis: 0,
          marker: { enabled: false },
        },
        {
          name: "Torque (Nm)",
          data: torqueValues,
          color: "#2fb8cf",
          yAxis: 1,
          marker: { enabled: false },
        },
      ],
      credits: { enabled: false },
    });
  }

  function renderComparisonChart(versions) {
    const labels = versions.map((v) => `${v.year} · ${v.trim}`);
    const powerValues = versions.map((v) => v.powerHp);

    const total = versions.reduce((sum, v) => sum + v.powerHp, 0);
    const averageHp = Math.round(total / versions.length);

    document.getElementById("avg-power").textContent =
      `Média histórica: ${averageHp} cv`;

    Highcharts.chart("comparison-chart", {
      chart: { type: "column", backgroundColor: "transparent" },
      title: { text: null },
      xAxis: {
        categories: labels,
        labels: { style: { color: "#c7cbd1" } },
      },
      yAxis: {
        title: { text: "Power (hp)" },
        gridLineColor: "rgba(255,255,255,0.06)",
      },
      legend: { enabled: false },
      series: [
        {
          name: "Power (hp)",
          data: powerValues,
          color: "#f2a71b",
        },
      ],
      credits: { enabled: false },
    });
  }

  function renderTable(versions) {
    const rowsHtml = versions
      .map((v) => {
        const row = { ...v, formattedPrice: formatCurrency(v.estimatedPrice) };

        return `
          <tr>
            <td>${row.year}</td>
            <td>${row.trim}</td>
            <td>${row.powerHp} cv</td>
            <td>${row.torqueKgm} kgm</td>
            <td>${row.weightKg} kg</td>
            <td>${row.zeroToHundredS} s</td>
            <td>${row.topSpeedKmh} km/h</td>
            <td>${row.formattedPrice}</td>
          </tr>`;
      })
      .join("");

    document.getElementById("table-body").innerHTML = rowsHtml;

    $("#versions-table").DataTable({
      paging: false,
      info: false,
      language: {
        search: "Buscar:",
        zeroRecords: "Nenhuma versão encontrada",
        emptyTable: "Sem dados disponíveis",
      },
      order: [[0, "asc"]],
    });

    $("#versions-table_filter input").on("keyup", function () {
      searchCount += 1;
      console.log(`Search actions performed: ${searchCount}`);
    });
  }
  function createUnitToggler() {
    let currentUnit = "cv";
    return {
      toggleUnit: function () {
        currentUnit = currentUnit === "cv" ? "kW" : "cv";
        return currentUnit;
      },
      getCurrentUnit: function () {
        return currentUnit;
      },
    };
  }
  const unitToggler = createUnitToggler();
  const buttonToggle = document.getElementById("unit-toggle");

  function updatePowerDisplay() {
    if (lastKnownPowerHp === null) return;
    const unit = unitToggler.getCurrentUnit();

    if (unit === "cv") {
      document.getElementById("stat-power").textContent = formatNumber(
        lastKnownPowerHp,
        " hp",
      );
      buttonToggle.textContent = "KW";
    } else if (unit === "kW") {
      const powerKw = Math.round(lastKnownPowerHp * 0.7355);
      document.getElementById("stat-power").textContent = formatNumber(
        powerKw,
        " KW",
      );
      buttonToggle.textContent = "HP";
    }
  }

  buttonToggle.addEventListener("click", () => {
    unitToggler.toggleUnit();
    updatePowerDisplay();
  });

  function renderPowerWeightScatter(versions) {
    // Calculate average values to define the quadrant boundaries.
    const averageWeight =
      versions.reduce(function (sum, car) {
        return sum + car.weightKg;
      }, 0) / versions.length;

    const averagePower =
      versions.reduce(function (sum, car) {
        return sum + car.powerHp;
      }, 0) / versions.length;

    // Calculate bubble radius based on torque.
    function calculateBubbleSize(torqueKgm) {
      const minTorque = 27;
      const maxTorque = 34;
      const minRadius = 7;
      const maxRadius = 18;

      const normalized = (torqueKgm - minTorque) / (maxTorque - minTorque);

      return minRadius + normalized * (maxRadius - minRadius);
    }

    // Determine the quadrant of each car.
    function getQuadrant(car) {
      const isLight = car.weightKg < averageWeight;
      const isPowerful = car.powerHp >= averagePower;

      if (isLight && isPowerful) {
        return "Light + Powerful";
      }

      if (!isLight && isPowerful) {
        return "Heavy + Powerful";
      }

      if (isLight && !isPowerful) {
        return "Light + Less Powerful";
      }

      return "Heavy + Less Powerful";
    }

    // Colors used for the bubbles.
    const colors = {
      "Heavy + Powerful": "#ff3b30",
      "Heavy + Less Powerful": "#f2c94c",
      "Light + Powerful": "#27ae60",
      "Light + Less Powerful": "#2d9cdb",
    };

    // Create one Highcharts series for each quadrant.
    const quadrants = {
      "Heavy + Powerful": [],
      "Heavy + Less Powerful": [],
      "Light + Powerful": [],
      "Light + Less Powerful": [],
    };

    versions.forEach(function (car) {
      const quadrant = getQuadrant(car);

      quadrants[quadrant].push({
        x: car.weightKg,
        y: car.powerHp,

        name: car.trim,
        year: car.year,

        weightKg: car.weightKg,
        powerHp: car.powerHp,
        torqueKgm: car.torqueKgm,

        zeroToHundredS: car.zeroToHundredS,
        topSpeedKmh: car.topSpeedKmh,
        estimatedPrice: car.estimatedPrice,

        powerToWeight: (car.powerHp / car.weightKg).toFixed(3),

        marker: {
          radius: calculateBubbleSize(car.torqueKgm),
        },
      });
    });

    // Get the chart limits with some extra space around the data.
    const weights = versions.map(function (car) {
      return car.weightKg;
    });

    const powers = versions.map(function (car) {
      return car.powerHp;
    });

    const minWeight = Math.min.apply(null, weights);
    const maxWeight = Math.max.apply(null, weights);
    const minPower = Math.min.apply(null, powers);
    const maxPower = Math.max.apply(null, powers);

    const weightPadding = 30;
    const powerPadding = 15;

    const xMin = minWeight - weightPadding;
    const xMax = maxWeight + weightPadding;
    const yMin = minPower - powerPadding;
    const yMax = maxPower + powerPadding;

    Highcharts.chart("power-weight-scatter", {
      chart: {
        type: "scatter",
        backgroundColor: "transparent",

        events: {
          render: function () {
            const chart = this;

            // Remove previous quadrant elements before redrawing.
            if (chart.quadrantGroup) {
              chart.quadrantGroup.destroy();
            }

            if (chart.quadrantLabelGroup) {
              chart.quadrantLabelGroup.destroy();
            }

            chart.quadrantGroup = chart.renderer
              .g("quadrant-backgrounds")
              .attr({
                zIndex: 0,
              })
              .add();

            chart.quadrantLabelGroup = chart.renderer
              .g("quadrant-labels")
              .attr({
                zIndex: 1,
              })
              .add();

            const plotLeft = chart.plotLeft;
            const plotTop = chart.plotTop;
            const plotWidth = chart.plotWidth;
            const plotHeight = chart.plotHeight;

            const xPosition = chart.xAxis[0].toPixels(averageWeight);
            const yPosition = chart.yAxis[0].toPixels(averagePower);

            // Coordinates relative to the plot area.
            const splitX = xPosition;
            const splitY = yPosition;

            // Background colors.
            const backgroundColors = {
              red: "rgba(255, 59, 48, 0.12)",
              yellow: "rgba(242, 201, 76, 0.12)",
              green: "rgba(39, 174, 96, 0.12)",
              blue: "rgba(45, 156, 219, 0.12)",
            };

            // Upper-left: Light + Powerful
            chart.renderer
              .rect(plotLeft, plotTop, splitX - plotLeft, splitY - plotTop, 0)
              .attr({
                fill: backgroundColors.green,
                stroke: "none",
              })
              .add(chart.quadrantGroup);

            // Upper-right: Heavy + Powerful
            chart.renderer
              .rect(
                splitX,
                plotTop,
                plotLeft + plotWidth - splitX,
                splitY - plotTop,
                0,
              )
              .attr({
                fill: backgroundColors.red,
                stroke: "none",
              })
              .add(chart.quadrantGroup);

            // Lower-left: Light + Less Powerful
            chart.renderer
              .rect(
                plotLeft,
                splitY,
                splitX - plotLeft,
                plotTop + plotHeight - splitY,
                0,
              )
              .attr({
                fill: backgroundColors.blue,
                stroke: "none",
              })
              .add(chart.quadrantGroup);

            // Lower-right: Heavy + Less Powerful
            chart.renderer
              .rect(
                splitX,
                splitY,
                plotLeft + plotWidth - splitX,
                plotTop + plotHeight - splitY,
                0,
              )
              .attr({
                fill: backgroundColors.yellow,
                stroke: "none",
              })
              .add(chart.quadrantGroup);

            // Add quadrant labels.
            const labels = [
              {
                text: "LIGHT + POWERFUL",
                x: plotLeft + 15,
                y: plotTop + 25,
              },
              {
                text: "HEAVY + POWERFUL",
                x: splitX + 15,
                y: plotTop + 25,
              },
              {
                text: "LIGHT + LESS POWERFUL",
                x: plotLeft + 15,
                y: plotTop + plotHeight - 15,
              },
              {
                text: "HEAVY + LESS POWERFUL",
                x: splitX + 15,
                y: plotTop + plotHeight - 15,
              },
            ];

            labels.forEach(function (label) {
              chart.renderer
                .text(label.text, label.x, label.y)
                .css({
                  color: "#ffffff",
                  fontSize: "11px",
                  fontWeight: "bold",
                  opacity: 0.65,
                })
                .add(chart.quadrantLabelGroup);
            });
          },
        },
      },

      title: {
        text: null,
      },

      xAxis: {
        min: xMin,
        max: xMax,

        title: {
          text: "Weight (kg)",
        },

        gridLineColor: "rgba(255,255,255,0.06)",

        plotLines: [
          {
            value: averageWeight,
            color: "rgba(255,255,255,0.35)",
            width: 1,
            dashStyle: "Dash",
            zIndex: 3,
          },
        ],
      },

      yAxis: {
        min: yMin,
        max: yMax,

        title: {
          text: "Power (hp)",
        },

        gridLineColor: "rgba(255,255,255,0.06)",

        plotLines: [
          {
            value: averagePower,
            color: "rgba(255,255,255,0.35)",
            width: 1,
            dashStyle: "Dash",
            zIndex: 3,
          },
        ],
      },

      tooltip: {
        useHTML: true,
        shared: false,

        formatter: function () {
          const point = this.point;

          return `
          <div style="min-width: 220px;">
            <strong>${point.name}</strong>
            <br>
            <span style="color: #999;">Year:</span> ${point.year}
            <br>
            <span style="color: #999;">Power:</span> ${point.powerHp} hp
            <br>
            <span style="color: #999;">Weight:</span> ${point.weightKg} kg
            <br>
            <span style="color: #999;">Torque:</span> ${point.torqueKgm} kgf·m
            <br>
            <span style="color: #999;">Power / Weight:</span> ${point.powerToWeight} hp/kg
            <br>
            <span style="color: #999;">0–100 km/h:</span> ${point.zeroToHundredS} s
            <br>
            <span style="color: #999;">Top speed:</span> ${point.topSpeedKmh} km/h
            <br>
            <span style="color: #999;">Estimated price:</span> ¥${point.estimatedPrice.toLocaleString()}
          </div>
        `;
        },
      },

      legend: {
        enabled: true,

        itemStyle: {
          color: "#c7cbd1",
          fontWeight: "normal",
        },

        itemHoverStyle: {
          color: "#ffffff",
        },
      },

      plotOptions: {
        scatter: {
          zIndex: 5,

          marker: {
            symbol: "circle",
            lineWidth: 1,
            lineColor: "rgba(255,255,255,0.35)",
          },

          states: {
            hover: {
              halo: {
                size: 10,
                opacity: 0.25,
              },
            },
          },
        },

        series: {
          animation: true,
        },
      },

      series: [
        {
          name: "Heavy + Powerful",
          color: colors["Heavy + Powerful"],
          data: quadrants["Heavy + Powerful"],
        },
        {
          name: "Heavy + Less Powerful",
          color: colors["Heavy + Less Powerful"],
          data: quadrants["Heavy + Less Powerful"],
        },
        {
          name: "Light + Powerful",
          color: colors["Light + Powerful"],
          data: quadrants["Light + Powerful"],
        },
        {
          name: "Light + Less Powerful",
          color: colors["Light + Less Powerful"],
          data: quadrants["Light + Less Powerful"],
        },
      ],

      credits: {
        enabled: false,
      },
    });
  }
  function init() {
    const loadingScreen = document.getElementById("loading");

    fetchRx7Data()
      .then((data) => {
        renderHero(data);
        renderPowerTorqueChart(data.powerCurve);
        renderComparisonChart(data.versions);
        renderTable(data.versions);
        renderPowerWeightScatter(data.versions);
      })
      .catch((error) => {
        console.error("Failed to load RX-7 data:", error);
      })
      .finally(() => {
        loadingScreen.classList.add("d-none");
      });
  }

  return { init };
})();

document.addEventListener("DOMContentLoaded", Rx7App.init);
