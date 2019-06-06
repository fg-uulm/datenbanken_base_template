<template>
  <b-container fluid class="main-container">
    <b-row>
      <b-col class="nav-col">
        <StationList  @show-station="switchDatasource" ref="stationnav" />
      </b-col>
      <b-col cols="10" class="data-col">
        <DataChart ref="datachart"/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
  import DataChart from '@/components/DataChart.vue'
  import StationList from '@/components/StationList.vue'
  export default {  
    name: 'Weather',
    props: {

    },
    components: {
      DataChart,
      StationList
    },
    methods: {
      switchDatasource (stationObj) {
        this.$refs.datachart.showStation(stationObj)
      },
    },    
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.main-container {
}
.row .nav-col {
  text-align: left;
  margin:0;
  padding:0;
}
</style>

