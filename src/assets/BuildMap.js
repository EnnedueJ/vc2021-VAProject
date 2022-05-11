const d3 = require('d3')

export default function BuildMap() {

    let topology;

    function me(selection) {
        //console.log(selection.datum())

        const boundaries = selection.node().parentNode.getBoundingClientRect();
        const projection = d3.geoMercator()
            .fitSize(
                [boundaries.width, boundaries.height],
                topology
            )

        const path = d3.geoPath().projection(projection)
        
        path.pointRadius(3)

        selection.selectAll("path")
            .data(selection.datum().features)
            .join("path")
                .attr("d", path)


        
    }    



                
        /*
        svg.selectAll("d")
                .data(topology.features)
                .join("text")
                .attr("class", "loc-label")
                .attr("transform", (d) => {
                    if (d.geometry != null) {
                        return "translate(" + projection(d.geometry.coordinates[0]) + ")"
                    } else {
                        return null
                    }
                })
                .text((d) => {
                    
                    if (d.geometry != null) {

                        const label = d.properties.FETYPE + " " + d.properties.FENAME
                        const labelsHidden = ["St","Rd","Ave","Way"]

                        return !labelsHidden.includes(d.properties.FETYPE) ? label : null
                    } 
                    return null
                })
                .attr("stroke","none")
                .attr("fill","black")
                .attr("style","font-size:15px")
            
        */
       

    me.addTopology = function(top) {
        topology = top
    }

    return me;

}
