<template>
  <div class="chart-container">
    <!-- TODO: In nächster Zeile station_name durch euren Spaltenname in dem der Stationsname gespeichert ist ersetzen -->
    <h2>Daten für Station: {{stationObj.station_name}}</h2>
    <line-chart @show-station="showStation" 
    :chart-data="datacollection" 
    :options="chartoptions"
    :styles="cStyles"></line-chart>
    <div class="switch-container">
      <b-form-group>
        <b-form-radio-group
        id="btn-radios-2"
        v-model="selectedSensor"
        :options="sensors"
        buttons
        button-variant="outline-primary"
        size="lg"
        name="radio-btn-outline"
        ></b-form-radio-group>
      </b-form-group>
    </div>
  </div>
</template>

<script>
  import LineChart from './LineChart.js'
  import axios from "axios";

  export default {
    components: {
      LineChart
    },
    data () {
      return {
        /*
        * Hier passiert die Grundkonfiguration unseres Bar-Charts
        */
        datacollection: {},
        chartoptions: { 
          scales: {
            xAxes: [{
              type: 'time',
              distribution: 'linear',
              bounds: 'data',
              ticks: {
                source: 'auto',
                autoSkip: true
              },
              time: {
                //TODO: in der nächsten Zeile kann der Bereich des Graphen definiert werden (2018 bis heute, Angabe für Woche geht auch: 2019W20)
                min: '2018',
              },
            }],
            yAxes: [{
              display: true,
              scaleLabel: {
                display: true,
                labelString: 'Wert'
              }
            }]
          } , responsive: true, maintainAspectRatio: false, },
          stationObj: Object,
          //TODO: hier einen existierenden Sensorname aus euren Sensoren eintragen damit am Anfang direkt Daten angezeigt werden
          selectedSensor: 'sensor1',
          sensors: [],
        }
      },
      computed: {
        cStyles () {
          return {
            height: '70vh',
            position: 'relative',
            padding: '80px',
            paddingBottom:'0px',
          }
        }
      },
      watch: {
        //Hier schauen wir ob ein anderer Sensor ausgewählt wurde, wenn ja laden wir neue Daten
        selectedSensor: function() {
          this.showStationData();
        }
      },
      methods: {

        showStation(stationObj) {
            this.stationObj = stationObj
            //Verfügbare Sensoren von unserem REST-Endpoint abholen
            //TODO: idstations in der nächsten Zeile so umbenennen wie eure Stations-ID-Spalte in der DB heißt
            axios.get("http://localhost:3000/station/"+this.stationObj.idstations+"/sensors")
            .then(response => {
              //Sensoren speichern
              this.sensors = [...response.data]
              //Ersten Sensor auswählen
              this.selectedSensor = this.sensors[0].text;
              //Daten für diesen Sensor laden
              this.showStationData();
            })
            .catch(err => {
                console.log("Fehler: "+err)      
            })
        },

        showStationData() {
           //Daten für den momentanen Sensor von unserem REST-Endpoint abholen
           //TODO: idstations in der nächsten Zeile so umbenennen wie eure Stations-ID-Spalte in der DB heißt
           axios.get("http://localhost:3000/station/"+this.stationObj.idstations+"/"+this.selectedSensor+"/data")
           .then(response => {
              //Empfangene Daten speichern
              var sensor_data = [...response.data]
              //Daten in "datacollection" schreiben, dadurch werden sie automatisch angezeigt
              this.datacollection = {
                labels: [this.selectedSensor],
                datasets: [
                {
                  label: this.selectedSensor,
                  fill: false,
                  lineTension: 0,
                  backgroundColor: 'rgba(200,120,10,0.8)',
                  borderColor:'rgba(100,120,10,0.4)',
                  data: sensor_data
                }]
              }
          })
          .catch(err => {
              console.log("Fehler: "+err)      
          })       
     },     
   }
 }
</script>

<style scoped>
.chart-container {
  height: 90vh;
  position:relative;
  margin-bottom: 0;
}
.switch-container {
  margin-left:100px;
}
.inline-switch {
  display: inline-block;
}
h2 {
  margin:30px;
}
</style>