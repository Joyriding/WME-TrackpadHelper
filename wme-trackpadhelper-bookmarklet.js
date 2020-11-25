// WME TrackpadHelper
// Minify and add 'javascript: ' to the beginning to make into a bookmarklet

(function () {
  
  // Toggle between enabled/disabled each run
  if (typeof (W.map.thEnabled) == 'undefined') {
    W.map.thEnabled = false;
    thEnable();
  } else {
    if (W.map.thEnabled) {
      thDisable();
    } else {
      thEnable();
    }
  }

  var canvas = document.getElementById('WazeMap');
  var defaultPanInPixel = W.map.DEFAULT_PAN_IN_PIXEL;
  canvas.requestPointerLock = canvas.requestPointerLock ||
    canvas.mozRequestPointerLock;

  document.exitPointerLock = document.exitPointerLock ||
    document.mozExitPointerLock;

  function thEnable() {
    var canvas = document.getElementById('WazeMap');
    W.map.thEnabled = true;
    W.map.events.listeners.moveendInitial = W.map.events.listeners.moveend;

    canvas.onmousedown = function () {
      // Preserve moveend listeners and prevent them from running with each mouse movement event
      W.map.events.listeners.moveendPreserved = W.map.events.listeners.moveend;
      W.map.events.listeners.moveend = null;
      console.log('mousedown');
      canvas.requestPointerLock();
    }


    canvas.onmouseup = function () {
      console.log('mouseup');
      document.removeEventListener("mousemove", updatePosition, false);
      W.map.events.listeners.moveend = W.map.events.listeners.moveendPreserved;
      if (W.map.events.listeners.moveend == null) {
        // Shouldn't happen, but if the listeners get lost restore them from when the script started
        W.map.events.listeners.moveend = W.map.events.listeners.moveendInitial;
      }
      // Force the moveend listener to run
      W.map.events.triggerEvent("moveend",null)
      document.exitPointerLock();
    }

    // Hook pointer lock state change events for different browsers
    document.addEventListener('pointerlockchange', lockChangeAlert, false);
    document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

    console.log('WME TrackpadHelper enabled.');
  }

  function thDisable() {
    var canvas = document.getElementById('WazeMap');
    W.map.thEnabled = false;
    document.exitPointerLock();
    canvas.onmousedown = null;
    canvas.mouseup = null;
    console.log('Trackpad Helper disabled.');
  }

  function lockChangeAlert() {
    if (document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas) {
      document.addEventListener("mousemove", updatePosition, false);
    } else {
      document.removeEventListener("mousemove", updatePosition, false);
    }
  }

  function updatePosition(e) {
    // Use the keyboard pan functions to move the map the number of pixels from the mouse event.
    // W.map.DEFAULT_PAN_IN_PIXEL gets temporarly overwritten as there is no way to pass a different value to the pan functions.
    x = e.movementX;
    y = e.movementY;

    if (x != 0) {
      W.map.DEFAULT_PAN_IN_PIXEL = Math.abs(x);
      if (x > 0) {
        W.map.panLeft();
      } else {
        W.map.panRight();
      }
    }

    if (y != 0) {
      W.map.DEFAULT_PAN_IN_PIXEL = Math.abs(y);
      if (y > 0) {
        W.map.panUp();
      } else {
        W.map.panDown();
      }
    }

    // TODO: Trigger moveend periodically

    // Set back to original value so that keyboard arrow keys work as expected
    W.map.DEFAULT_PAN_IN_PIXEL = defaultPanInPixel

  }
})();
