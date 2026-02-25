<template>
  <div class="inner-container">
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
        Once there has been a generated hint related to you, it will appear in the Hints tab.
      </p>

      <p class="mb-0">
        To buy hints, you can use the <strong>"Buy item hint"</strong> button or use the <strong>!hint</strong> command.
      </p>
    </fieldset>

    <fieldset class="mt-3">
      <legend><strong>Players</strong></legend>
      
      <p class="mt-0 mb-0">
        The Players tab will show a table of all registered players, the game they are playing, and their current status.
      </p>
    </fieldset>

    <fieldset class="mt-3">
      <legend><strong>Tracker</strong></legend>
      
      <p class="mt-0 mb-0">
        The Tracker tab shows you all collected items, and all locations and whether they are checked or not.
      </p>
    </fieldset>

    <fieldset class="mt-3">
      <legend><strong>General</strong></legend>
      
      <p class="mt-0 ">
        All tables can be sorted by clicking on the column headers.
      </p>

      <p class="mb-0">
        Other than the Chat tab, each section only updates when you switch to it. To refresh any list, simply go to another tab and then back to the desired tab.
      </p>
    </fieldset>
  </div>
</template>