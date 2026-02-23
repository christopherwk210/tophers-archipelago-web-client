<template>
  <div class="help">

    <fieldset>
      <legend><strong>Chat</strong></legend>
      
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
      <legend><strong>Hints</strong></legend>
      
      <p class="mt-0">
        Once there has been a generated hint related to you, it will appear in the Hints tab. When viewing hints,
        you can click on the column headers to sort the table by that column.
      </p>

      <p class="mb-0">
        To generate hints, use the <strong>!hint</strong> command.
      </p>
    </fieldset>

    <fieldset class="mt-3">
      <legend><strong>Players</strong></legend>
      
      <p class="mt-0">
        The Players tab will show a table of all registered players, the game they are playing, and their current status.
        Just like the Hints tab, clicking the column headers will sort the table by that column.
      </p>

      <p class="mb-0">
        Note that the information in this tab does not update live. To refresh the list, simply go to another tab and then back to Players.
      </p>
    </fieldset>
  </div>
</template>

<style scoped>
.help {
  overflow: auto;
  padding-right: 1em;
}
</style>