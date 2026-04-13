<script lang="ts">
  import Brightness from "./lib/Brightness.svelte";
  import FanSpeed from "./lib/FanSpeed.svelte";
  import RunAnimation from "./lib/RunAnimation.svelte";
  import Message from "./lib/Message.svelte";
  let currentIP = "http://192.168.4.1";
  let isOnline = false;
  let isConnecting = false;

  async function testConnection() {
    isConnecting = true;
    try {
      // First, get the latest IP from the Dev Server backend
      let discoverResponse = await fetch('/api/get-ip');
      if (discoverResponse.ok) {
        let json = await discoverResponse.json();
        if (json.ip && json.ip !== currentIP) {
          currentIP = json.ip;
        }
      }

      let response = await fetch(`${currentIP}/test`);
      if (response.ok) {
        isOnline = true;
      } else {
        isOnline = false;
      }
    } catch (error) {
      isOnline = false;
    }
    isConnecting = false;
  }

  testConnection();
  setInterval(testConnection, 5000);
</script>

<main>
  <div class="status">
    <span class="header">Protogen Control Panel</span>

    <p>
      Your protogen is {#if isOnline}
        💚 <span class="online">online</span>{:else}
        💔 <span class="offline">offline</span
        >{/if}{#if isConnecting}?{:else}.{/if}
    </p>
    <p>
      <span>Current adress: <input type="text" bind:value={currentIP} /></span>
    </p>
  </div>

  <div class="columns">
    <div class="column">
      <div>Animations</div>
      <div class="animations">
        <RunAnimation name="squiggle" url={currentIP} />
        <RunAnimation name="hearts" url={currentIP} />
        <RunAnimation name="confuzed" url={currentIP} />
        <RunAnimation name="smile" url={currentIP} />
        <RunAnimation name="blush" url={currentIP} />
        <RunAnimation name="gay" url={currentIP} />
      </div>
    </div>
    <div class="column">
      <div>Brightness</div>
      <Brightness url={currentIP} />
      <div>Fan Speed</div>
      <FanSpeed url={currentIP} /> 
      <Message url={currentIP}/>
    </div>
  </div>
</main>

<style>
  .online {
    color: greenyellow;
  }
  .offline {
    color: red;
  }

  .status {
    border-width: 4px;
    border-style: solid;
    border-color: #1a1a1a;
    border-radius: 8px;
    padding: 4px;
    margin: 4px;
    font-size: 1.2rem;
  }

  .header {
    font-size: 2em;
    margin: 8px;
  }

  .columns {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: 1fr 1fr;
  }

  input[type="number"] {
    width: 3rem;
  }
</style>
