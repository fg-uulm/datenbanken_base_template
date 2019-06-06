<template>
  <div id="app">
    <div id="nav">
      <router-link to="/weather">Weather</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: black;
  max-height:100%;
  height:100vh;
}
#nav {
  padding: 20px;
  border-bottom: 3px solid #007bff;
}

#nav a {
  font-weight: bold;
  color: black;
}

#nav a.router-link-exact-active {
  color: #007bff;
}
</style>
