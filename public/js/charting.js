/**
 * Created by darulebreaker on 3/17/14.
 */
//chart options
var options = {'showRowNumber': true,
    'sort':'enable',
    'sortAscending':false,
    'sortColumn':0};
options['page'] = 'enable';
options['pageSize'] = 10;
options['pagingSymbols'] = {prev: 'prev', next: 'next'};
options['pagingButtonsConfiguration'] = 'auto';

var options3 = {'title':'Line chart',
    'width':900,
    'height':300};
var options4 = {'title':'Line chart',
    'width':900,
    'height':300};


function drawVisualization() {

    // Instantiate and draw our chart, passing in some options.

    var data1 =  google.visualization.arrayToDataTable(events, true);
    var table = new google.visualization.Table(document.getElementById('table_div'));
    table.draw(data1, options);



    var dashboard = new google.visualization.Dashboard(
        document.getElementById('dashboard'));
    var startDate = data[data.length-30][0];
    var endDate = data[data.length-1][0];
    console.log("Start: "+startDate+"  end: "+endDate);
    var control = new google.visualization.ControlWrapper({
        'controlType': 'ChartRangeFilter',
        'containerId': 'control',
        'options': {
            // Filter by the date axis.
            'filterColumnIndex': 0,
            'ui': {
                'chartType': 'LineChart',
                'chartOptions': {
                    'chartArea': {'width': '90%'},
                    'hAxis': {'baselineColor': 'none'}
                },
                // Display a single series that shows the closing value of the stock.
                // Thus, this view has two columns: the date (axis) and the stock value (line series).
                'chartView': {
                    'columns': [0, 3]
                },
                // 1 day in milliseconds = 24 * 60 * 60 * 1000 = 86,400,000
                'minRangeSize': 300000
            }
        },
        // Initial range: 2012-02-09 to 2012-03-20.

        'state': {'range': {'start': startDate, 'end': endDate}}
    });

    var chart = new google.visualization.ChartWrapper({
        'chartType': 'CandlestickChart',
        'containerId': 'chart',
        'options': {
            // Use the same chart area width as the control for axis alignment.
            'chartArea': {'height': '80%', 'width': '90%'},
            'hAxis': {'slantedText': false},

            'legend': {'position': 'none'}
        },
        'view': {
            'columns': [
                {
                    'calc': function(dataTable, rowIndex) {
                        return dataTable.getFormattedValue(rowIndex, 0);
                    },
                    'type': 'string'
                }, 1, 2, 3, 4]
        }

        // Convert the first column from 'date' to 'string'.

    });

   // console.log(data);

    var d = google.visualization.arrayToDataTable(data, true);

    dashboard.bind(control, chart);
    dashboard.draw(d);


    var data3 =  google.visualization.arrayToDataTable(equity, true);


    var chart3 = new google.visualization.LineChart(document.getElementById('chart_div3'));
    chart3.draw(data3, options3);

    var data4= google.visualization.arrayToDataTable(myEvents, true);
    var annotatedtimeline = new google.visualization.AnnotatedTimeLine(
        document.getElementById('visualization'));
    annotatedtimeline.draw(data4, {'displayAnnotations': true,
        'scaleType':'maximized'});
}
