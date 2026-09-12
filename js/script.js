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
  function init() {
    const loadingScreen = document.getElementById("loading");

    fetchRx7Data()
      .then((data) => {
        renderHero(data);
        renderPowerTorqueChart(data.powerCurve);
        renderComparisonChart(data.versions);
        renderTable(data.versions);
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
