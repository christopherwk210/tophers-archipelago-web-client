<template>
  <div class="inner-container">
    <fieldset>
      <legend><img class="legend-icon" src="@/assets/icons/warning-fill.png"> <strong>Troubleshooting</strong></legend>
      
      <p class="mt-0">
        If you're seeing things that don't seem right, like missing or extra hints, you can try the following steps:
      </p>

      <ol class="mb-0">
        <li>Click on the <strong>More</strong> tab</li>
        <li>Click on the <strong>Settings</strong> tab</li>
        <li>Scroll to the bottom and click on the <strong>Clear Cache</strong> button</li>
        <li>Refresh the page</li>
      </ol>

      <!-- <p class="mb-0">
        Other than the Chat tab, each section only updates when you switch to it. To refresh any list, simply go to another tab and then back to the desired tab.
      </p> -->
    </fieldset>

    <fieldset class="mt-3">
      <legend><img class="legend-icon" src="@/assets/icons/info.png"> <strong>General</strong></legend>
      
      <p class="mt-0 ">
        All tables can be sorted by clicking on the column headers.
      </p>

      <p class="mb-0">
        Other than the Chat tab, each section only updates when you switch to it. To refresh any list, simply go to another tab and then back to the desired tab.
      </p>
    </fieldset>

    <fieldset class="mt-3">
      <legend><img class="legend-icon" src="@/assets/icons/info.png"> <strong>Chat</strong></legend>
      
      <p class="mt-0">
        The Chat tab contains all of the messages that have been sent and received since you've logged in. To send a message
        or use commands, type in the box at the bottom of the screen and then press Enter.
      </p>
  
      <p>
        When sending messages, this client supports a few rich text features:
      </p>
      <ul>
        <li><em>*Italics*</em></li>
        <li><strong>**Bold**</strong></li>
        <li><a href="#" @click.prevent="">http://automatic-links</a></li>
      </ul>
  
      <p>
        If you want to resend the message you just sent, press the Up Arrow key while the input box is focused. This will recall your last message, allowing you to edit it before sending again.
      </p>
  
      <p class="mb-0">
        You can clear the entire chat log by sending <strong>/clear</strong>.
      </p>
    </fieldset>
  
    <fieldset class="mt-3">
      <legend><img class="legend-icon" src="@/assets/icons/info.png"> <strong>Hints</strong></legend>
      
      <p class="mt-0">
        Once there has been a generated hint related to you, it will appear in the Hints tab.
      </p>

      <p>
        To buy hints, you can use the <strong>Buy item hint</strong> button or use the <strong>!hint</strong> command.
      </p>

      <p class="mb-0">
        The <strong>Hide found hints</strong> toggle will hide any hints that have already been found.
      </p>
    </fieldset>

    <fieldset class="mt-3">
      <legend><img class="legend-icon" src="@/assets/icons/info.png"> <strong>Players</strong></legend>
      
      <p class="mt-0">
        The Players tab will show a table of all registered players, the game they are playing, and their current status.
      </p>

      <p class="mb-0">
        The <strong>Show player progress</strong> toggle will show the progress of each player as a progress bar.
        <br>
        <small>
          <em>Note</em>: This feature requires automatically sending the !status command on your behalf.
          It will be hidden in your chat, but other players may see it.
        </small>
      </p>
    </fieldset>

    <fieldset class="mt-3">
      <legend><img class="legend-icon" src="@/assets/icons/info.png"> <strong>Tracker</strong></legend>
      
      <p class="mt-0">
        The Tracker tab shows you all collected items, and all locations and whether they are checked or not.
      </p>

      <p class="mb-0">
        You can buy location hints using the <strong>Buy location hint</strong> button, and already checked locations can be hidden using the <strong>Hide checked locations</strong> toggle.
      </p>
    </fieldset>
  </div>
</template>

<style scoped>
p {
  line-height: 1.5;
}

legend {
  display: flex;
  gap: 0.3em;
}

.legend-icon {
  height: 1em;
  align-self: center;
}
</style>