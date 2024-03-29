<template>
    <div>
        <div :id="id" :data="popsAggr" :layout="layout" :options="options"/>
    </div>
</template>

<script>
const Plotly = require("plotly.js/dist/plotly-gl2d.min.js");
const d3 = require("d3");

export default {
    name: "ParallelCoordinates",
    props: {
        id: String,
        popsAggr: Array,
        xaxis: Object,
        title: String,
    },
    data() {
        return {
            finalData : [],
            data : {
                type: "parcoords",
                line: {
                    showscale: true,
                    reversescale: true,
                    colorscale: "Jet",
                    color: 2500
                },
                labelfont: {
                    size: 18,
                },
                rangefont: {
                    size: 15
                },
                tickfont: {
                    size: 12
                },
            },
            layout: {
                width:900,
                height: 900,
                font: {
                    family: "Trebuchet MS, sans-serif"
                },

            },
            options: {
                displayModeBar: false,
            }
        }
    },
    mounted() {
        this.plot = d3.select("#"+this.id).node()
        Plotly.newPlot(this.plot, [this.data], this.layout, this.options)

    },
    watch: {
        popsAggr(datum) {
            this.finalData = datum.map(row => {
                return {
                    ...row,
                    card : row.ccnum ? String(row.ccnum) : row.loyaltynum,
                }
            })

            const cards = this.unpack(this.finalData, 'card')
            const dates = this.unpack(this.finalData, 'date').map(d => d.getDate()+"th")
            const times = this.unpack(this.finalData, 'time')
            const locations = this.unpack(this.finalData, 'location')
            const prices = this.unpack(this.finalData, 'price')
            const setCards = [...new Set(cards)]
            const setDates = [...new Set(dates)]
            const setLocations = [...new Set(locations)]

            this.data.dimensions = [{
                    label: "card",
                    values: cards.map(c => setCards.indexOf(c)),
                    range: [0,setCards.length],
                    ticktext: setCards,
                    tickvals: d3.range(setCards.length),
                }, {
                    label: "date",
                    values: dates.map(d => setDates.indexOf(d)),
                    range: [0,setDates.length],
                    ticktext: setDates,
                    tickvals: d3.range(setDates.length)
                }, {
                    label: "time",
                    values: times,
                    range: [0,Math.max(...times)],
                },{
                    label: "location",
                    values: locations.map(l => setLocations.indexOf(l)),
                    range: [0,setLocations.length],
                    ticktext: setLocations,
                    tickvals: d3.range(setLocations.length)
                }, {
                    label: "price",
                    values: prices,
                    range: [0,Math.max(...prices)]
                }
            ]

            this.data.line.color = this.unpack(this.finalData, 'price').map(Number)

            Plotly.react(this.plot, [this.data], this.layout, this.options)
            
        },
    },
    methods: {
        unpack(rows, key) {
            return rows.map(function(row) {
                return row[key];
            });
        }
    }
}
</script>

<style scoped>
* {
    margin: 0;
}

h6 {
    padding-left: 15px;
}

#plot-6 {
    height: 900px;
}
</style>