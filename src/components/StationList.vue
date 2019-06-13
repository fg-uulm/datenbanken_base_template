<template>
    <div>
        <b-list-group 
        class="list-main"
        v-for="station in stations" 
        :key="station.id"
        >
        <!-- TODO: idstations in der nächsten Zeile so umbenennen wie eure Stations-ID-Spalte in der DB heißt -->
        <b-list-group-item href="#" 
                           class="flex-column align-items-start" 
                           @click="showStation(station)"
                           :class="{ 'active': activeItem == station.idstations }">
            <div class="d-flex w-100 justify-content-between">
                <!-- TODO: station_name in der nächsten Zeile so umbenennen wie eure Stationsname-Spalte in der DB heißt -->
                <h5 class="mb-1">{{station.station_name}}</h5>
                <small>10 sec ago</small>
            </div>

            <p class="mb-1">
                <!-- TODO: station_location in der nächsten Zeile so umbenennen wie eure Stations-Standort-Spalte in der DB heißt -->
                <!-- wenn nicht vorhanden einfach löschen -->
                Standort: {{station.station_location}}
            </p>
        </b-list-group-item>        
    </b-list-group>
</div>
</template>

<script>
    import axios from "axios";

    export default {  
        data() {
            return {
                stations: [],
                activeItem: Number
            };
        },
        mounted() {
            /*
            *   Hier holen wir die Stationsliste von unserem Endpoint ab
            */
            axios.get("http://localhost:3000/station")
            .then(response => {
                //Durch Update der "stations"-Variable wird auch die Liste aktualisiert
                this.stations = [...response.data]
                this.activeItem = 1
                this.$emit('show-station', this.stations[0])
            })
            .catch(err => {
                console.log("Fehler: "+err)      
            })                      
        },
        methods: {
            showStation(stationObj) {
                this.$emit('show-station', stationObj)
                //TODO: idstations in den nächsten 2 Zeilen so umbenennen wie eure Stations-ID-Spalte in der DB heißt
                console.log("Showing station "+stationObj.idstations)
                this.activeItem = stationObj.idstations
            },
        },
    };
</script>

<style scoped>
.list-main {
    width:100%;
}
</style>
