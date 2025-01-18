const ChartOptions = (xLabel, yLabel, chartType = "line") => {
  if (chartType === "pie") {
    return {
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
      },
      responsive: true,
    };
  }

  if (chartType === "bar") {
    return {
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      plugins: {
        legend: {
          display: false,
        },
      },
      tooltips: {
        backgroundColor: "#f5f5f5",
        titleFontColor: "#333",
        bodyFontColor: "#666",
        bodySpacing: 4,
        xPadding: 12,
        mode: "nearest",
        intersect: 0,
        position: "nearest",
      },
      responsive: true,
      scales: {
        x: {
          title: { display: true, text: xLabel },
          grid: {
            display: false,
          },
        },
        y: {
          title: { display: true, text: yLabel },
          grid: {
            display: false,
          },
        },
      },
    };
  }

  return {
    maintainAspectRatio: false,
    legend: {
      display: false,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    tooltips: {
      backgroundColor: "#f5f5f5",
      titleFontColor: "#333",
      bodyFontColor: "#666",
      bodySpacing: 4,
      xPadding: 12,
      mode: "nearest",
      intersect: 0,
      position: "nearest",
    },
    responsive: true,
    scales: {
      x: {
        title: { display: true, text: xLabel },
        grid: {
          color: "rgba(29,140,248,0.2)",
        },
      },
      y: {
        title: { display: true, text: yLabel },
        grid: {
          display: false,
        },
        suggestedMin: 0,
      },
    },
  };
};

const LineChartConfig = (
  labels,
  titleA,
  dataA,
  titleB = undefined,
  dataB = undefined
) => {
  return (canvas) => {
    let ctx = canvas.getContext("2d");

    let gradientStroke1 = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke1.addColorStop(1, "rgba(29,140,248,0.2)");
    gradientStroke1.addColorStop(0.4, "rgba(29,140,248,0.05)");
    gradientStroke1.addColorStop(0, "rgba(29,140,248,0)");

    let gradientStroke2 = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke2.addColorStop(1, "rgba(75,192,121,0.2)");
    gradientStroke2.addColorStop(0.4, "rgba(75,192,121,0.05)");
    gradientStroke2.addColorStop(0, "rgba(75,192,121,0)");

    const datasets =
      dataB !== undefined && titleB !== undefined
        ? [
            {
              label: titleA,
              fill: true,
              tension: 0.5,
              backgroundColor: gradientStroke1,
              borderColor: "rgb(29,140,248)",
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: "rgb(29,140,248)",
              pointBorderColor: "rgba(255,255,255,0)",
              pointHoverBackgroundColor: "rgb(29,140,248)",
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: dataA,
            },
            {
              label: titleB,
              fill: true,
              tension: 0.5,
              backgroundColor: gradientStroke2,
              borderColor: "rgb(75,192,121)",
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: "rgb(75,192,121)",
              pointBorderColor: "rgba(255,255,255,0)",
              pointHoverBackgroundColor: "rgb(75,192,121)",
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: dataB,
            },
          ]
        : [
            {
              label: titleA,
              fill: true,
              tension: 0.5,
              // stepped: true,
              backgroundColor: gradientStroke1,
              borderColor: "rgb(29,140,248)",
              borderWidth: 2,
              borderDash: [],
              borderDashOffset: 0.0,
              pointBackgroundColor: "rgb(29,140,248)",
              pointBorderColor: "rgba(255,255,255,0)",
              pointHoverBackgroundColor: "rgb(29,140,248)",
              pointBorderWidth: 20,
              pointHoverRadius: 4,
              pointHoverBorderWidth: 15,
              pointRadius: 4,
              data: dataA,
            },
          ];

    return {
      labels,
      datasets
    };
  };
};

const PieChartConfig = (title, labels, data) => {
  return (canvas) => {
    let ctx = canvas.getContext("2d");

    // Create gradient for the pie chart segments
    let gradientColors = [];
    const colors = [
      "rgba(29,140,248,0.95)", // blue
      "rgba(253,203,110,0.95)", // yellow
      "rgba(66,134,121,0.95)", // green
      "rgba(75,192,192,0.95)", // teal
      "rgba(255,99,132,0.95)", // red
    ];

    labels.forEach((_, i) => {
      const gradient = ctx.createLinearGradient(0, 0, 100, 100);

      gradient.addColorStop(1, colors[i % colors.length]);
      gradient.addColorStop(0.4, colors[i % colors.length]);
      gradient.addColorStop(0, colors[i % colors.length]);

      // gradient.addColorStop(0, colors[i % colors.length]);
      // gradient.addColorStop(1, "rgba(255,255,255,0.5)");
      gradientColors.push(gradient);
    });

    return {
      labels,
      datasets: [
        {
          label: title,
          data,
          backgroundColor: gradientColors,
          hoverBackgroundColor: colors,
          borderColor: "rgba(255,255,255,1)",
          borderWidth: 2,
        },
      ],
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
          tooltip: {
            callbacks: {
              label: (tooltipItem) => {
                const value = tooltipItem.raw;
                return `${labels[tooltipItem.dataIndex]}: ${value}`;
              },
            },
          },
        },
      },
    };
  };
};

module.exports = {
  ChartOptions,
  LineChartConfig,
  PieChartConfig,
};
