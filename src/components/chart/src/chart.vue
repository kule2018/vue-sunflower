/**
* Created by alex on 2017/3/27.
 */

<template>
    <div :id="this.chart.name" :style="size"></div>
</template>

<script type="text/babel">
    import myChart from './chart.interface'
    export default{
      name:'sChart',
      props:{
        chart: {
          type: Object
        }
      },
       computed: {
         size() {
            let style={};
            style.width=this.chart.width;
            style.height=this.chart.height;
            return style;
         }
       },
       mounted() {
         switch (this.chart.type){
           case 'ringChart' : myChart.ringChart(this.chart.name,this.chart.data,this.chart.itemName,this.chart.isReverseColor,this.chart.option);break;
           case 'ringCharts' : myChart.ringCharts(this.chart.name,this.chart.data,this.chart.option);break;
           case 'ringSameCharts' : myChart.ringSameCharts(this.chart.name,this.chart.data,this.chart.option);break;
           case 'statRingChart' : myChart.statRingChart(this.chart.name,this.chart.data,this.chart.option);break;
           case 'pieChart' : myChart.pieChart(this.chart.name,this.chart.data,this.chart.itemName,this.chart.option);break;
           case 'gaugeChart' : myChart.gaugeChart(this.chart.name,this.chart.data,this.chart.itemName,this.chart.option);break;
           case 'newgaugeChart' : myChart.newgaugeChart(this.chart.name,this.chart.data,this.chart.itemName,this.chart.option);break;
           case 'statusChart' : myChart.statusChart(this.chart.name,this.chart.data,this.chart.itemName,this.chart.option);break;
           case 'rainbowBarChart' : myChart.rainbowBarChart(this.chart.name,this.chart.data,this.chart.option);break;
           case 'colorfulBarChart' : myChart.colorfulBarChart(this.chart.name,this.chart.data,this.chart.option);break;
           case 'percentBarChart' : myChart.percentBarChart(this.chart.name,this.chart.data,this.chart.itemName);break;
           case 'stackBarChart' : myChart.stackBarChart(this.chart.name,this.chart.data);break;
           case 'stackChart' : myChart.stackChart(this.chart.name,this.chart.data,this.chart.unit,this.chart.option);break;
           case 'multiBarChart' : myChart.multiBarChart(this.chart.name,this.chart.data,this.chart.option);break;
           case 'lineChart' : myChart.lineChart(this.chart.name,this.chart.data,this.chart.itemName,this.chart.option);break;
           case 'statusLineChart' : myChart.statusLineChart(this.chart.name,this.chart.data,this.chart.itemName,this.chart.option);break;
           case 'multilineChart' : myChart.multilineChart(this.chart.name,this.chart.data,this.chart.option);break;
           case 'areaChart' : myChart.areaChart(this.chart.name,this.chart.data,this.chart.unit,this.chart.option);break;
           case 'areaWordChart' : myChart.areaWordChart(this.chart.name,this.chart.data,this.chart.itemName,this.chart.option);break;
         }
       }
    }
</script>

<style>

</style>
