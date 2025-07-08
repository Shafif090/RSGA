document.addEventListener("DOMContentLoaded", function () {

    function createChart(containerId, value, label) {
        let chartOptions = {
            series: [value],
            chart: {
                height: 250,
                type: 'radialBar',
                fontFamily: 'Poppins',
            },
            plotOptions: {
                radialBar: {
                    track: {
                        background: '#809ac84b', // Background color of the unfilled part
                    },
                    hollow: {
                        size: '70%',
                    },
                    dataLabels: {
                        name: {
                            fontSize: '20px',
                            fontWeight: 'bold',
                            color: 'white',
                            offsetY: 40 
                        },
                        value: {
                            fontSize: '50px',
                            fontWeight: 'bold',
                            color: '#A76FB8',
                            offsetY: -10,
                            formatter: function (val) {
                                return val; // Removes the percentage symbol
                            }
                        }
                    }
                }
            },
            labels: [label],
        };

        let chart = new ApexCharts(document.querySelector(`#${containerId}`), chartOptions);
        chart.render();
    }

    // Create Two Charts with Different Values and Labels {arguments - containerID, value, label}
    createChart("goalChart", 40, "GOALS");
    createChart("assistChart", 70, "ASSISTS");

});