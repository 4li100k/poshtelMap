//basic map config with custom fills, mercator projection
    var map = new Datamap({
        scope: 'world',
        element: document.getElementById('container1'),
        projection: 'mercator',
        height: 800,
        fills: {
            defaultFill: '#c8ff80',
            lt50: 'rgba(0,244,244,0.9)',
            gt50: '#FF0000',
            slovookia: 'green',
            occupied: '#648040',
            USA: '#1f77b4',
            RUS: '#9467bd',
            PRK: '#ff7f0e',
            PRC: '#2ca02c',
            IND: '#e377c2',
            GBR: '#8c564b',
            FRA: '#d62728',
            PAK: '#7f7f7f',
            chicken: '#0FFFFF',
        },

        data: {
//            USA: {fillKey: 'gt50' },
//            RUS: {fillKey: 'lt50' },
//            CAN: {fillKey: 'lt50' },
//            BRA: {fillKey: 'gt50' },
//            ARG: {fillKey: 'gt50'},
//            COL: {fillKey: 'gt50' },
//            AUS: {fillKey: 'gt50' },
//            ZAF: {fillKey: 'gt50' },
//            MAD: {fillKey: 'gt50' },
            DNK: {fillKey: 'occupied'},
        },

        setProjection: function(element) {
            var projection = d3.geo.equirectangular()
                .center([13, 40])
                .rotate([4.4, 0])
                .scale(200)
                .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
            var path = d3.geo.path()
                .projection(projection);

            return {path: path, projection: projection};
        },

        geographyConfig: {
            dataUrl: null, // If not null, datamaps will fetch the map JSON (currently only supports topojson)
            borderWidth: 0.05,
            borderOpacity: 1,
            borderColor: '#000000',
            popupOnHover: true, // True to show the popup while hovering
            highlightOnHover: true,
            highlightFillColor: '#FC8D59',
            highlightBorderColor: 'rgba(250, 15, 160, 0.2)',
            highlightBorderWidth: 1,
            highlightBorderOpacity: 1,
            popupTemplate: function(geography, data) {
            return "<div class='hoverinfo'><b>" + geography.properties.name + "</b><br/></div>";
            }
        },


        //make selected country disappear
        /*done: function(datamap) {
            datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                var m = {};
                m[geography.id] = '#FFFFFF';
                datamap.updateChoropleth(m);
            });
        }*/

        done: function(datamap){

            datamap.svg.call(d3.behavior.zoom().on("zoom", redraw));
            function redraw() {
                datamap.svg.selectAll("g").attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                datamap.svg.select('g').selectAll('path').style('vector-effect', 'non-scaling-stroke');
                 rescaleWorld(datamap);
                rescaleBubbles(datamap);
            }


            /*datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
                var m = {};
                m[geography.id] = '#FFFFFF';
                datamap.updateChoropleth(m);
            }*/
        },

    });

    var bombs = [{
        name: 'RDS-37',
        radius: 15,//
        yield: 1600,
        country: 'USSR',
        fillKey: 'RUS',//
        date: '1955-11-22',
        latitude: 50.07,//
        longitude: 78.43,//
        file: 'pdf',
        format: '.pdf',

    },{
        name: 'Tsar Bomba',
        radius: 15,
        yield: 50000,
        country: 'USSR',
        fillKey: 'RUS',
        date: '1961-10-31',
        latitude: 73.482,
        longitude: 54.5854,
        file: 'cat',
        format: '.jpg',
    },{
        name: 'chicken',
        radius: 15,
        yield: 'chicken',
        country: 'chicken',
        fillKey: 'chicken',
        date: 'chicken',
        latitude: 55.7023846,
        longitude: 12.5861773,
        file: 'chicken',
        format: '.pdf'
    }
    ];

    //declare bubbles and make them display their name
    map.bubbles(bombs, {
        popupTemplate: function(geo, data) {
            return ['<div class="hoverinfo"><b>' +  data.name,
                '</b><br/>Payload: ' +  data.yield + ' kilotons',
                '<br/>Country: ' +  data.country + '',
                '<br/>Date: ' +  data.date + '',
                '</div>'].join('');
        },

    });

    //bubble click
    d3.selectAll(".datamaps-bubble").on('click', function(bubble) {
        document.getElementById("displayP").innerHTML = document.getElementById("displayP").innerHTML + "<br/>opening " + bubble.file + bubble.format;
        //map.bubbles([]);//deletes all bubbles
        if (bubble.format === '.pdf')
            document.getElementById("bubbleDisplay").innerHTML = "<object type='application/pdf' width='100%' height='100%' data='"+bubble.file+bubble.format+"'></object>";
        else
            document.getElementById("bubbleDisplay").innerHTML = "<img src='" + bubble.file + bubble.format + "'>";
    });

    /*function(datamap) {
        datamap.svg.selectAll('.datamaps-subunit').on('click', function(geography) {
            var m = {};
            m[geography.id] = '#FFFFFF';
            datamap.updateChoropleth(m);
        });
    }*/

    //make slovakia green
    function greenSlovakia(){
        map.updateChoropleth({
            SVK: {fillKey: 'slovookia'}
        });
    }

function rescaleWorld(datamap) {
    datamap.svg
        .selectAll('g')
        .attr('transform', 'translate(' + d3.event.translate + ') scale(' + d3.event.scale + ')');
}

function rescaleBubbles(datamap) {
    var bubbleRadius = 15;
    var bubbleBorder = 1;

    datamap.svg
        .selectAll('.datamaps-bubble')
        .attr('r', bubbleRadius / d3.event.scale)
        .style('stroke-width', (bubbleBorder / d3.event.scale) + 'px');
}